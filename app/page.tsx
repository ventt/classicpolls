"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import TopicCard from "@/components/TopicCard";
import FancySelect from "@/components/FancySelect";

type Sort = { by: "ratio" | "popularity" | "positive" | "negative"; dir: "asc" | "desc" };

export default function Page() {
    const { data: session, status } = useSession();
    const isLoadingSession = status === "loading";

    // Filters / sorting
    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState<string | undefined>();
    // Alap: legjobban elfogadott felül
    const [sort, setSort] = useState<Sort>({ by: "ratio", dir: "desc" });

    // Data
    const [categories, setCategories] = useState<any[]>([]);
    const [topics, setTopics] = useState<any[]>([]);

    // Server-side pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    // Fetch categories once
    useEffect(() => {
        fetch("/api/categories").then((r) => r.json()).then(setCategories);
    }, []);

    // When filters change, reset to page 1
    useEffect(() => {
        setPage(1);
    }, [search, categoryId, sort]);

    // Fetch topics (server-side sorting + pagination)
    useEffect(() => {
        let aborted = false;
        async function run() {
            setLoading(true);
            try {
                const res = await fetch("/api/topics/query", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ categoryId, search, sort, page, pageSize }),
                });
                const data = await res.json();
                if (!aborted) {
                    setTopics(data.items ?? []);
                    setTotalPages(data.totalPages ?? 1);
                }
            } finally {
                if (!aborted) setLoading(false);
            }
        }
        run();
        return () => { aborted = true; };
    }, [search, categoryId, sort, page, pageSize]);

    const handleVote = async (topicId: string, value: number) => {
        const res = await fetch("/api/votes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topicId, value }),
        });
        if (res.ok) {
            // Újratöltjük az aktuális oldalt, hogy a statok frissüljenek
            const refresh = await fetch("/api/topics/query", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ categoryId, search, sort, page, pageSize }),
            });
            const data = await refresh.json();
            setTopics(data.items ?? []);
            setTotalPages(data.totalPages ?? 1);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-12 gap-4 p-4">
            {/* LEFT ADS */}
            <aside className="hidden lg:block col-span-2 sticky top-4 h-[80vh] border border-zinc-800 rounded-xl bg-zinc-900/50 backdrop-blur-sm flex items-center justify-center">
                <span className="text-zinc-400">Ad</span>
            </aside>

            {/* MAIN (fix header + filters; only list scrolls) */}
            <main className="col-span-12 lg:col-span-8 flex flex-col gap-4">
                {/* HEADER */}
                <header className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <h1
                        className="text-5xl font-extrabold tracking-wide text-transparent bg-clip-text tracking-wider
                       bg-gradient-to-b from-emerald-200 via-lime-300 to-emerald-600
                       drop-shadow-[0_0_4px_rgba(50,255,150,0.25)]"
                        style={{
                            textShadow: `0 0 2px rgba(40,180,120,0.25), 0 0 6px rgba(50,220,150,0.15)`,
                        }}
                    >
                        Wow&nbsp;<span className="text-lime-300">Votes</span>
                    </h1>
                    {isLoadingSession ? (
                        <div className="text-zinc-400">Loading...</div>
                    ) : session ? (
                        <div className="flex items-center gap-3">
                            {session.user?.image ? (
                                <img src={session.user.image} alt="avatar" className="w-8 h-8 rounded-full" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-zinc-700" />
                            )}
                            <span className="font-medium">{session.user?.name}</span>
                            <Link
                                href="/new-topic"
                                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition"
                            >
                                New Topic
                            </Link>
                            <button
                                className="px-3 py-1 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition"
                                onClick={() => signOut()}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition"
                            onClick={() => signIn("discord")}
                        >
                            Sign in with Discord
                        </button>
                    )}
                </header>
                {/* TAGLINE / HERO BLUR-BAR */}
                <div
                    className="relative rounded-xl border border-emerald-600/30
                               bg-gradient-to-b from-emerald-900/30 via-zinc-900/30 to-zinc-900/20
                               px-4 py-3 shadow-[0_0_0_1px_rgba(16,185,129,0.08)_inset,0_6px_20px_rgba(16,185,129,0.06)]
                               backdrop-blur-sm">
                    <p className="flex flex-wrap items-center gap-2 text-sm leading-relaxed text-center justify-center">
                    <span className="font-semibold text-zinc-100">
                         Community-powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-lime-300 to-emerald-400">Classic+</span> vision — where players imagine and shape the World of Warcraft they truly want.
                    </span>
                    </p>
                </div>


                {/* FILTERS (fixed) */}
                <section className="flex flex-wrap gap-2 items-center">
                    <input
                        className="border border-zinc-800 bg-zinc-900 text-zinc-100 rounded-lg px-3 py-2 flex-1 placeholder:text-zinc-500"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <FancySelect
                        ariaLabel="Filter by category"
                        widthClass="w-56"
                        value={categoryId || ""}
                        onChange={(val) => setCategoryId(val || undefined)}
                        options={[
                            { label: "All categories", value: "" },
                            ...categories.map((c: any) => ({ label: c.name, value: c.id })),
                        ]}
                    />

                    <FancySelect
                        ariaLabel="Sort topics"
                        widthClass="w-56"
                        value={`${sort.by}:${sort.dir}`}
                        onChange={(val) => {
                            const [by, dir] = val.split(":") as [Sort["by"], Sort["dir"]];
                            setSort({ by, dir });
                        }}
                        options={[
                            { label: "Most approved ↓ (default)", value: "ratio:desc" },
                            { label: "Least approved ↑", value: "ratio:asc" },
                            { label: "Most popular ↓", value: "popularity:desc" },
                            { label: "Least popular ↑", value: "popularity:asc" },
                            { label: "Most upvotes ↓", value: "positive:desc" },
                            { label: "Most downvotes ↓", value: "negative:desc" },
                        ]}
                    />
                </section>

                {/* PAGINATION (top) */}
                <PaginationBar
                    page={page}
                    totalPages={totalPages}
                    onPrev={() => setPage((p) => Math.max(1, p - 1))}
                    onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
                    pageSize={pageSize}
                    onPageSize={(ps) => { setPageSize(ps); setPage(1); }}
                    loading={loading}
                />

                {/* TOPICS – ONLY THIS SCROLLS */}
                <div className="max-h-[65vh] overflow-y-auto pr-1 fancy-scrollbar">
                    <ul className="grid gap-3">
                        {topics.map((t) => (
                            <TopicCard
                                key={t.id}
                                topic={t}
                                onVote={handleVote}
                                loggedIn={!!session}
                            />
                        ))}
                        {!loading && topics.length === 0 && (
                            <li className="text-zinc-400 text-sm">No topics found.</li>
                        )}
                    </ul>
                </div>

                {/* PAGINATION (bottom) */}
                <PaginationBar
                    page={page}
                    totalPages={totalPages}
                    onPrev={() => setPage((p) => Math.max(1, p - 1))}
                    onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
                    pageSize={pageSize}
                    onPageSize={(ps) => { setPageSize(ps); setPage(1); }}
                    loading={loading}
                />
            </main>

            {/* RIGHT ADS */}
            <aside className="hidden lg:block col-span-2 sticky top-4 h-[80vh] border border-zinc-800 rounded-xl bg-zinc-900/50 backdrop-blur-sm flex items-center justify-center">
                <span className="text-zinc-400">Ad</span>
            </aside>
        </div>
    );
}

function PaginationBar({
                           page,
                           totalPages,
                           onPrev,
                           onNext,
                           pageSize,
                           onPageSize,
                           loading,
                       }: {
    page: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
    pageSize: number;
    onPageSize: (n: number) => void;
    loading: boolean;
}) {
    return (
        <div className="flex items-center justify-between text-sm text-zinc-300">
      <span>
        Page <span className="font-medium">{page}</span> / {totalPages}
          {loading ? <span className="ml-2 text-zinc-500">Loading…</span> : null}
      </span>
            <div className="flex items-center gap-3">
                <FancySelect
                    ariaLabel="Page size"
                    widthClass="w-28"
                    value={String(pageSize)}
                    onChange={(v) => onPageSize(Number(v))}
                    options={[
                        { label: "6 / page", value: "6" },
                        { label: "12 / page", value: "12" },
                        { label: "24 / page", value: "24" },
                        { label: "48 / page", value: "48" },
                    ]}
                />
                <div className="flex gap-2">
                    <button
                        className="px-3 py-1 rounded-lg border border-zinc-700 hover:bg-zinc-800 disabled:opacity-50"
                        onClick={onPrev}
                        disabled={page <= 1 || loading}
                    >
                        Prev
                    </button>
                    <button
                        className="px-3 py-1 rounded-lg border border-zinc-700 hover:bg-zinc-800 disabled:opacity-50"
                        onClick={onNext}
                        disabled={page >= totalPages || loading}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
