import {redirect} from "next/navigation";
import Link from "next/link";
import {getServerAuth} from "@/lib/auth";
import NewPollForm from "./new-poll-form";
import AdLessLayout from "@/app/adless-layout";
import {fetchCategories} from "@/lib/postgrest/category";

export default async function NewTopicPage() {
    const session = await getServerAuth();
    if (!session?.user.id) {
        redirect("/api/auth/signin?callbackUrl=/new-poll");
    }
    const categories = await fetchCategories();

    return (
        <AdLessLayout>
            <main className="col-span-12 lg:col-span-8 flex flex-col gap-4">
                <header className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <h1 className="text-2xl font-bold text-white">Create a New Poll</h1>
                    <Link
                        href="/"
                        className="px-3 py-1 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition text-zinc-400"
                    >
                        Back
                    </Link>
                </header>

                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 shadow-sm">
                    <NewPollForm categories={categories}/>
                </div>
            </main>
        </AdLessLayout>
    );
}
