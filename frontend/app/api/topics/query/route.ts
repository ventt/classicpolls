import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

type Sort =
    | { by: "ratio"; dir: "asc" | "desc" }
    | { by: "popularity"; dir: "asc" | "desc" } // total votes
    | { by: "positive"; dir: "asc" | "desc" }
    | { by: "negative"; dir: "asc" | "desc" };

export async function POST(req: Request) {
    const body = await req.json();
    const categoryId: string | undefined = body?.categoryId || undefined;
    const search: string | undefined = body?.search || undefined;
    const sort: Sort = body?.sort || { by: "ratio", dir: "desc" };
    const page = Math.max(1, Number(body?.page ?? 1));
    const pageSize = Math.min(50, Math.max(5, Number(body?.pageSize ?? 12)));
    const offset = (page - 1) * pageSize;

    // WHERE feltételek
    const whereClauses: Prisma.Sql[] = [];
    const params: any[] = [];

    if (categoryId) {
        params.push(categoryId);
        whereClauses.push(Prisma.sql`t."categoryId" = ${Prisma.join([categoryId])}`);
    }
    if (search) {
        const like = `%${search}%`;
        params.push(like);
        whereClauses.push(Prisma.sql`t."title" ILIKE ${like}`);
    }


    const whereSql =
        whereClauses.length > 0
            // @ts-ignore
            ? Prisma.sql`WHERE ${Prisma.join(whereClauses, Prisma.sql` AND `)}`
            : Prisma.empty;

    // ORDER BY a kért rendezés szerint
    const orderSql = (() => {
        const dir = sort.dir.toUpperCase() === "ASC" ? Prisma.sql`ASC` : Prisma.sql`DESC`;
        if (sort.by === "ratio") return Prisma.sql`ORDER BY ratio ${dir}, "createdAt" DESC`;
        if (sort.by === "popularity") return Prisma.sql`ORDER BY total ${dir}, "createdAt" DESC`;
        if (sort.by === "positive") return Prisma.sql`ORDER BY pos ${dir}, "createdAt" DESC`;
        if (sort.by === "negative") return Prisma.sql`ORDER BY neg ${dir}, "createdAt" DESC`;
        return Prisma.sql`ORDER BY ratio DESC, "createdAt" DESC`;
    })();

    // COUNT (összes találat)
    // @ts-ignore
    const countRows = await prisma.$queryRaw<
        { count: bigint }[]
    >(Prisma.sql`
    SELECT COUNT(*)::bigint AS count
    FROM "Topic" t
    ${whereSql}
  `);
    const total = Number(countRows?.[0]?.count ?? 0);
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    // Fő lekérdezés: aggregált szavazatok + arány, globális rendezéssel és LIMIT/OFFSET
    // @ts-ignore
    const rows = await prisma.$queryRaw<
        {
            id: string;
            title: string;
            description: string | null;
            "categoryId": string;
            "createdById": string;
            "createdAt": Date;
            categoryName: string | null;
            pos: number;
            neg: number;
            total: number;
            ratio: number;
        }[]
    >(Prisma.sql`
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
      GROUP BY "topicId"
    )
    SELECT
      t.id, t.title, t.description, t."categoryId", t."createdById", t."createdAt",
      c.name AS "categoryName",
      COALESCE(a.pos, 0) AS pos,
      COALESCE(a.neg, 0) AS neg,
      COALESCE(a.total, 0) AS total,
      COALESCE(a.ratio, 0) AS ratio
    FROM "Topic" t
    LEFT JOIN agg a ON a."topicId" = t.id
    LEFT JOIN "Category" c ON c.id = t."categoryId"
    ${whereSql}
    ${orderSql}
    LIMIT ${pageSize} OFFSET ${offset}
  `);

    // @ts-ignore
    const items = rows.map(r => ({
        id: r.id,
        title: r.title,
        description: r.description,
        category: r.categoryName ? { name: r.categoryName } : null,
        stats: { pos: Number(r.pos), neg: Number(r.neg), total: Number(r.total), ratio: Number(r.ratio) },
    }));

    return NextResponse.json({
        items,
        page,
        pageSize,
        total,
        totalPages,
    });
}
