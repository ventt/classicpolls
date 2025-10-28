// app/api/votes/route.ts (POST)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerAuth } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await getServerAuth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { topicId, value } = await req.json(); // value: 1 vagy -1

    try {
        const vote = await prisma.vote.upsert({
            where: { topicId_userId: { topicId, userId: session.user.id } },
            create: { topicId, userId: session.user.id, value },
            update: { value },
        });
        return NextResponse.json(vote);
    } catch (e) {
        return NextResponse.json({ error: "Vote failed" }, { status: 400 });
    }
}