import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerAuth } from "@/lib/auth";

export async function POST(req: Request) {
    const body = await req.json().catch(() => ({}));
    const { topicId, reason, details } = body;
    if (!topicId || !reason) return NextResponse.json({ error: "topicId and reason required" }, { status: 400 });

    // optional: get reporter id if logged in
    let reporterId: string | null = null;
    try {
        const session = await getServerAuth();
        reporterId = session?.user?.id ?? null;
    } catch { reporterId = null; }

    const report = await prisma.report.create({
        data: {
            topicId,
            reporterId,
            reason: String(reason).slice(0, 500),
            details: (details ? String(details).slice(0, 2000) : null),
        },
    });

    return NextResponse.json(report, { status: 201 });
}
