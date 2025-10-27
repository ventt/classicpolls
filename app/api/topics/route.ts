// app/api/topics/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerAuth } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await getServerAuth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { title, description, categoryId } = await req.json();

    const topic = await prisma.topic.create({
        data: {
            title,
            description,
            categoryId,
            createdById: session.user.id,
        },
    });

    return NextResponse.json(topic);
}
