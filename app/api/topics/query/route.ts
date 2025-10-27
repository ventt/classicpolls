// app/api/topics/query/route.ts (POST)
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Sort =
    | { by: "ratio"; dir: "desc" | "asc" }
    | { by: "popularity"; dir: "desc" | "asc" } // szavazatszám
    | { by: "positive"; dir: "desc" | "asc" }
    | { by: "negative"; dir: "desc" | "asc" };

export async function POST(req: Request) {
    const { categoryId, search, sort }: { categoryId?: string; search?: string; sort?: Sort } = await req.json();

    const where = {
        ...(categoryId ? { categoryId } : {}),
        ...(search
            ? { title: { contains: search, mode: "insensitive" } }
            : {}),
    };

    const topics = await prisma.topic.findMany({
        where,
        include: {
            votes: true,
            category: true,
        },
    });

    // @ts-ignore
    const withStats = topics.map((t) => {
        // @ts-ignore
        const pos = t.votes.filter((v) => v.value > 0).length;
        // @ts-ignore
        const neg = t.votes.filter((v) => v.value < 0).length;
        const total = pos + neg;
        const ratio = total === 0 ? 0 : pos / total; // pozitív arány
        return { ...t, stats: { pos, neg, total, ratio } };
    });

    const s = sort || { by: "ratio", dir: "desc" } as Sort; // alap: pozitív arány csökkenő
    // @ts-ignore
    withStats.sort((a, b) => {
        const by = s.by;
        const dir = s.dir === "desc" ? -1 : 1;
        if (by === "ratio") return (a.stats.ratio - b.stats.ratio) * dir;
        if (by === "popularity") return (a.stats.total - b.stats.total) * dir;
        if (by === "positive") return (a.stats.pos - b.stats.pos) * dir;
        if (by === "negative") return (a.stats.neg - b.stats.neg) * dir;
        return 0;
    }).reverse();

    return NextResponse.json(withStats);
}