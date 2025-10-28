import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerAuth } from "@/lib/auth";

export async function GET() {
    const session = await getServerAuth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const topics = await prisma.topic.findMany({
        where: { createdById: session.user.id },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            description: true,
            createdAt: true,
            category: { select: { name: true } },
            votes: { select: { value: true } },
        },
    });

    // @ts-ignore
    const items = topics.map(t => {
        // @ts-ignore
        const pos = t.votes.filter(v => v.value > 0).length;
        // @ts-ignore
        const neg = t.votes.filter(v => v.value < 0).length;
        const total = t.votes.length;
        const ratio = total ? pos / total : 0;
        return {
            id: t.id,
            title: t.title,
            description: t.description,
            createdAt: t.createdAt,
            category: t.category ? { name: t.category.name } : null,
            stats: { pos, neg, total, ratio },
        };
    });

    return NextResponse.json({ items });
}
