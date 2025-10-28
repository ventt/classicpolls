import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    ctx: { params: Promise<{ id: string }> }
) {
    const { id } = await ctx.params;

    const url = new URL(req.url);
    const limit = Math.max(1, Math.min(100, Number(url.searchParams.get("limit") ?? 6)));

    const votes = await prisma.vote.findMany({
        where: { topicId: id },
        orderBy: { createdAt: "desc" },
        take: limit, // ⬅ max 6 (alapértelmezés)
        select: {
            id: true,
            value: true,
            createdAt: true,
            user: { select: { id: true, name: true, image: true } },
        },
    });

    return NextResponse.json({
        // @ts-ignore
        items: votes.map(v => ({
            id: v.id,
            value: v.value,
            createdAt: v.createdAt,
            user: { id: v.user.id, name: v.user.name, image: v.user.image },
        })),
    });
}
