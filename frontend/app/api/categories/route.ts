// app/api/categories/route.ts  (vagy src/app/api/categories/route.ts)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ha nincs path alias, használd a relatív utat: "../../../../../lib/prisma"

export async function GET() {
    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
    });
    return NextResponse.json(categories);
}
