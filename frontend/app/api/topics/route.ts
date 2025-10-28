import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerAuth } from "@/lib/auth";

const TITLE_LIMIT = 75;

export async function POST(req: Request) {
    const session = await getServerAuth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let payload: any;
    try {
        payload = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const rawTitle = typeof payload?.title === "string" ? payload.title : "";
    const title = rawTitle.trim();
    const description =
        typeof payload?.description === "string" ? payload.description.trim() : null;
    const categoryId =
        typeof payload?.categoryId === "string" ? payload.categoryId : "";

    if (!title) return NextResponse.json({ error: "Title is required." }, { status: 400 });
    if (title.length > TITLE_LIMIT) {
        return NextResponse.json({ error: `Title must be ${TITLE_LIMIT} characters or fewer.` }, { status: 400 });
    }
    if (!categoryId) return NextResponse.json({ error: "Category is required." }, { status: 400 });

    try {
        const topic = await prisma.topic.create({
            data: {
                title,
                description: description || null,
                categoryId,
                createdById: session.user.id,
            },
        });
        return NextResponse.json(topic, { status: 201 });
    } catch (err: any) {
        // Prisma kódos hibaüzenetek
        if (err?.code === "P2003") {
            // foreign key constraint failed (pl. rossz categoryId)
            return NextResponse.json({ error: "Invalid category." }, { status: 400 });
        }
        if (err?.code === "P2002") {
            // unique violation (ha lenne ilyen constraint a title-re)
            return NextResponse.json({ error: "Duplicate topic." }, { status: 409 });
        }
        // naplózhatod lokálban, de ne szivárogjon ki a kliensnek
        console.error("Create topic error:", err);
        return NextResponse.json({ error: "Failed to create topic." }, { status: 500 });
    }
}
