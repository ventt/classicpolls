"use client";

import {useState} from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import AdLessLayout from "@/app/adless-layout";
import {PollDetails} from "@/lib/model/poll-details";


function handleDelete(pollItem: PollDetails) {
    alert(pollItem.title + " poll was deleted.");
}

export default function MyPollsPage() {
    const [polls, setPolls] = useState<PollDetails[]>([]);
    const [deleting, setDeleting] = useState<string | null>(null);

    return (
        <AdLessLayout>
            <main className="col-span-12 lg:col-span-8 flex flex-col gap-4">
                <SiteHeader />

                <div className="flex items-center justify-between mt-2">
                    <h2 className="text-xl font-semibold text-white">My Polls</h2>
                    <Link
                        href="/new-poll"
                        className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition"
                    >
                        New Topic
                    </Link>
                </div>
                    <ul className="grid gap-3">
                        {polls.map((pollItem) => (
                            <li
                                key={pollItem.id}
                                className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/60"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <Link
                                            href={`/poll/${pollItem.id}`}
                                            className="font-semibold text-lg text-white hover:underline"
                                        >
                                            {pollItem.title}
                                        </Link>
                                        <p className="text-sm text-zinc-400">
                                            {pollItem.category_name} •{" "}
                                            {new Date(pollItem.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(pollItem)}
                                        disabled={deleting === pollItem.id}
                                        className="px-3 py-1 rounded-lg border border-red-700/60 bg-red-900/30 hover:bg-red-800/40 disabled:opacity-50 transition text-red-200"
                                        title="Delete topic"
                                    >
                                        {deleting === pollItem.id ? "Deleting…" : "Delete"}
                                    </button>
                                </div>

                                {pollItem.description && (
                                    <p className="mt-2 text-sm text-zinc-300 line-clamp-3">
                                        {pollItem.description}
                                    </p>
                                )}

                            </li>
                        ))}
                    </ul>
            </main>
        </AdLessLayout>
    );
}
