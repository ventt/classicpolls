import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import {getServerAuth} from "@/lib/auth";

export async function GET(
    _req: Request,
    ctx: { params: Promise<{ id: string }> } // ⬅ params: Promise
) {
    const { id } = await ctx.params;          // ⬅ await params

    // aggregált adatok egy topicra
    // @ts-ignore
    const rows = await prisma.$queryRaw<{
        id: string;
        title: string;
        description: string | null;
        categoryId: string | null;
        categoryName: string | null;
        pos: number;
        neg: number;
        total: number;
        ratio: number;
        createdAt: Date;
    }[]>(Prisma.sql`
        WITH agg AS (
            SELECT
                "topicId",
                COUNT(*) FILTER (WHERE value > 0) AS pos,
                COUNT(*) FILTER (WHERE value < 0) AS neg,
                COUNT(*) AS total,
                CASE
                    WHEN COUNT(*) = 0 THEN 0::float
            ELSE (COUNT(*) FILTER (WHERE value > 0))::float / COUNT(*)::float
        END AS ratio
      FROM "Vote"
      WHERE "topicId" = ${id}
        GROUP BY "topicId"
        )
        SELECT
            t.id, t.title, t.description, t."categoryId", t."createdAt",
            c.name AS "categoryName",
            COALESCE(a.pos, 0) AS pos,
            COALESCE(a.neg, 0) AS neg,
            COALESCE(a.total, 0) AS total,
            COALESCE(a.ratio, 0) AS ratio
        FROM "Topic" t
                 LEFT JOIN agg a ON a."topicId" = t.id
                 LEFT JOIN "Category" c ON c.id = t."categoryId"
        WHERE t.id = ${id}
            LIMIT 1
    `);

    const r = rows?.[0];
    if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
        id: r.id,
        title: r.title,
        description: r.description,
        category: r.categoryName ? { name: r.categoryName } : null,
        stats: { pos: Number(r.pos), neg: Number(r.neg), total: Number(r.total), ratio: Number(r.ratio) },
        createdAt: r.createdAt,
    });
}
export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
    const session = await getServerAuth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await ctx.params;

    const topic = await prisma.topic.findUnique({
        where: { id },
        select: { id: true, createdById: true },
    });

    if (!topic) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (topic.createdById !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.$transaction([
        prisma.vote.deleteMany({ where: { topicId: id } }),
        prisma.topic.delete({ where: { id } }),
    ]);

    return new NextResponse(null, { status: 204 });
}