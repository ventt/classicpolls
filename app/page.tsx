"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import TopicCard from "@/components/TopicCard";
import FancySelect from "@/components/FancySelect";


export default function Page() {
    const { data: session, status } = useSession();
    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState<string | undefined>();
    const [sort, setSort] = useState({ by: "ratio", dir: "asc" } as any);
    const [categories, setCategories] = useState<any[]>([]);
    const [topics, setTopics] = useState<any[]>([]);
    const isLoading = status === "loading";

    const fetchData = async () => {
        const res = await fetch("/api/topics/query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ categoryId, search, sort }),
        });
        const data = await res.json();
        setTopics(data);
    };

    useEffect(() => {
        fetch("/api/categories").then((r) => r.json()).then(setCategories);
    }, []);

    useEffect(() => { fetchData(); }, [search, categoryId, sort]);

    const handleVote = async (topicId: string, value: number) => {
        const res = await fetch("/api/votes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topicId, value }),
        });
        if (res.ok) fetchData();
    };

    return (
        <div className="min-h-screen grid grid-cols-12 gap-4 p-4">
            {/* LEFT ADS */}
            <aside className="hidden lg:block col-span-2 sticky top-4 h-[80vh] border border-zinc-800 rounded-xl bg-zinc-900/50 backdrop-blur-sm flex items-center justify-center">
                <span className="text-zinc-400">Ad</span>
            </aside>

            {/* MAIN */}
            <main className="col-span-12 lg:col-span-8 flex flex-col gap-4">
                {/* HEADER */}
                <header className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <h1
                        className="text-5xl font-extrabold tracking-wide text-transparent bg-clip-text
                                   tracking-wider bg-gradient-to-b from-emerald-200 via-lime-300
                                   to-emerald-600 drop-shadow-[0_0_4px_rgba(50,255,150,0.25)]"
                        style={{
                            textShadow: `
                              0 0 2px rgba(40, 180, 120, 0.25),
                              0 0 6px rgba(50, 220, 150, 0.15)
                            `,
                        }}
                    >
                        Wow&nbsp;<span className="text-lime-300">Votes</span>
                    </h1>


                    {isLoading ? (
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

                {/* FILTERS */}
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
                            const [by, dir] = val.split(":");
                            setSort({ by, dir });
                        }}
                        options={[
                            { label: "Most approved ↓ (default)", value: "ratio:asc" },
                            { label: "Least approved ↑", value: "ratio:desc" },
                            { label: "Most popular ↓", value: "popularity:asc" },
                            { label: "Least popular ↑", value: "popularity:desc" },
                            { label: "Most upvotes ↓", value: "positive:asc" },
                            { label: "Most downvotes ↓", value: "negative:asc" },
                        ]}
                    />
                </section>

                {/* TOPICS */}
                <ul className="grid gap-3">
                    {topics.map((t) => (
                        <TopicCard
                            key={t.id}
                            topic={t}
                            onVote={handleVote}
                            loggedIn={!!session}
                        />
                    ))}
                </ul>

            </main>

            {/* RIGHT ADS */}
            <aside className="hidden lg:block col-span-2 sticky top-4 h-[80vh] border border-zinc-800 rounded-xl bg-zinc-900/50 backdrop-blur-sm flex items-center justify-center">
                <span className="text-zinc-400">Ad</span>
            </aside>
        </div>
    );
}
