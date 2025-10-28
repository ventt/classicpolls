"use client";

import { useMemo, useState } from "react";
import TopicCard from "@/components/TopicCard";

type Topic = {
    id: string;
    title: string;
    description?: string | null;
    category?: { name: string };
    stats: { pos: number; neg: number; total: number; ratio: number };
};

export default function TopicsList({
                                       topics,
                                       onVote,
                                       loggedIn,
                                       pageSize = 12,
                                       heightClass = "max-h-[70vh]", // állítható, pl. max-h-[65vh]
                                   }: {
    topics: Topic[];
    onVote: (topicId: string, value: 1 | -1) => void;
    loggedIn: boolean;
    pageSize?: number;
    heightClass?: string;
}) {
    const [page, setPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil((topics?.length ?? 0) / pageSize));
    const clampedPage = Math.min(page, totalPages);

    const pageItems = useMemo(() => {
        const start = (clampedPage - 1) * pageSize;
        return topics.slice(start, start + pageSize);
    }, [topics, clampedPage, pageSize]);

    const goPrev = () => setPage((p) => Math.max(1, p - 1));
    const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

    return (
        <div className="flex flex-col gap-2 min-h-0">
            {/* Top pagination */}
            <Pagination
                page={clampedPage}
                totalPages={totalPages}
                onPrev={goPrev}
                onNext={goNext}
            />

            {/* SCROLLABLE LISTA */}
            <div className={`${heightClass} overflow-y-auto pr-1 min-h-0`}>
                <ul className="grid gap-3">
                    {pageItems.map((t) => (
                        <TopicCard
                            key={t.id}
                            topic={t}
                            onVote={onVote}
                            loggedIn={loggedIn}
                        />
                    ))}
                </ul>
            </div>

            {/* Bottom pagination */}
            <Pagination
                page={clampedPage}
                totalPages={totalPages}
                onPrev={goPrev}
                onNext={goNext}
            />
        </div>
    );
}

function Pagination({
                        page,
                        totalPages,
                        onPrev,
                        onNext,
                    }: {
    page: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
}) {
    return (
        <div className="flex items-center justify-between text-sm text-zinc-300">
      <span>
        Page <span className="font-medium">{page}</span> / {totalPages}
      </span>
            <div className="flex gap-2">
                <button
                    className="px-3 py-1 rounded-lg border border-zinc-700 hover:bg-zinc-800 disabled:opacity-50"
                    onClick={onPrev}
                    disabled={page <= 1}
                >
                    Prev
                </button>
                <button
                    className="px-3 py-1 rounded-lg border border-zinc-700 hover:bg-zinc-800 disabled:opacity-50"
                    onClick={onNext}
                    disabled={page >= totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
