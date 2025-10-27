import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import NewTopicForm from "./NewTopicForm";

export default async function NewTopicPage() {
    const session = await getServerAuth();
    if (!session?.user?.id) {
        redirect("/api/auth/signin?callbackUrl=/new-topic");
    }

    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

    return (
        <div className="min-h-screen grid grid-cols-12 gap-4 p-4">
            <aside className="hidden lg:block col-span-2 sticky top-4 h-[80vh] border border-zinc-800 rounded-xl bg-zinc-900/50 backdrop-blur-sm flex items-center justify-center">
                <span className="text-zinc-400">Ad</span>
            </aside>

            <main className="col-span-12 lg:col-span-8 flex flex-col gap-4">
                <header className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <h1 className="text-2xl font-bold text-white">Create a New Topic</h1>
                    <Link
                        href="/"
                        className="px-3 py-1 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition"
                    >
                        Back
                    </Link>
                </header>

                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 shadow-sm">
                    <NewTopicForm categories={categories} />
                </div>
            </main>

            <aside className="hidden lg:block col-span-2 sticky top-4 h-[80vh] border border-zinc-800 rounded-xl bg-zinc-900/50 backdrop-blur-sm flex items-center justify-center">
                <span className="text-zinc-400">Ad</span>
            </aside>
        </div>
    );
}
