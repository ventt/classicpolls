// components/TopicInteractions.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession, signIn } from "next-auth/react";

type Stats = { pos: number; neg: number; total: number; ratio: number };
type VoteItem = { id: string; value: number; createdAt: string; user: { id: string; name?: string | null; image?: string | null } };

export default function TopicInteractions({ topicId, initialStats }: { topicId: string; initialStats: Stats; }) {
    const { status } = useSession();
    const loggedIn = status === "authenticated";

    const [stats, setStats] = useState<Stats>(initialStats);
    const [votes, setVotes] = useState<VoteItem[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState<null | 1 | -1>(null);

    const posPct = useMemo(
        () => (stats.total ? Math.round((stats.pos / stats.total) * 100) : 0),
        [stats]
    );

    async function loadAll() {
        setLoading(true);
        try {
            const [detailRes, votesRes] = await Promise.all([
                fetch(`/api/topics/${topicId}`, { cache: "no-store" }),
                fetch(`/api/topics/${topicId}/votes?limit=6`, { cache: "no-store" }),
            ]);
            if (detailRes.ok) {
                const d = await detailRes.json();
                setStats(d.stats);
            }
            if (votesRes.ok) {
                const v = await votesRes.json();
                setVotes(v.items);
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [topicId]);

    async function vote(value: 1 | -1) {
        if (!loggedIn) return; // Biztonsági guard
        setSending(value);
        try {
            const res = await fetch("/api/votes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topicId, value }),
            });
            if (res.ok) {
                await loadAll();
            }
        } finally {
            setSending(null);
        }
    }

    return (
        <div className="mt-5 space-y-5">
            {/* progress + action */}
            <div>
                <div className="flex items-center justify-between gap-3">
                    <div className="text-sm text-zinc-400">
                        <span className="font-medium text-zinc-200">{posPct}%</span> positive • {stats.pos} up / {stats.neg} down • {stats.total} votes
                    </div>

                    {/* ⬇⬇⬇ csak bejelentkezve mutassuk a gombokat */}
                    {loggedIn ? (
                        <div className="flex items-center gap-2">
                            <button
                                aria-label="Upvote"
                                disabled={sending !== null}
                                onClick={() => vote(1)}
                                className="p-2 rounded-lg border border-emerald-700/60 bg-emerald-900/30 hover:bg-emerald-800/50 active:scale-95 transition disabled:opacity-50"
                                title="Upvote"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-emerald-400">
                                    <path d="M12 4l-7 8h4v8h6v-8h4l-7-8z" fill="currentColor" />
                                </svg>
                            </button>
                            <button
                                aria-label="Downvote"
                                disabled={sending !== null}
                                onClick={() => vote(-1)}
                                className="p-2 rounded-lg border border-red-700/60 bg-red-900/30 hover:bg-red-800/50 active:scale-95 transition disabled:opacity-50"
                                title="Downvote"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-red-400">
                                    <path d="M12 20l7-8h-4V4H9v8H5l7 8z" fill="currentColor" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        // Kijelentkezve: finom CTA
                        <button
                            onClick={() => signIn("discord")}
                            className="text-xs px-2 py-1 rounded-md border border-zinc-700 hover:bg-zinc-800 text-zinc-200 transition"
                        >
                            Sign in to vote
                        </button>
                    )}
                </div>

                <div className="mt-2 h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${posPct}%` }} />
                </div>
            </div>

            {/* timeline (változatlan) */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40">
                <div className="px-4 py-3 border-b border-zinc-800 text-sm text-zinc-300">Recent votes</div>

                {loading ? (
                    <div className="p-4 text-sm text-zinc-400">Loading…</div>
                ) : votes && votes.length > 0 ? (
                    <ul className="divide-y divide-zinc-800">
                        {votes.slice(0, 6).map((v, idx) => {
                            const faded = idx === 5;
                            return (
                                <li
                                    key={v.id}
                                    className={`px-4 py-3 flex items-center gap-3 transition ${faded ? "opacity-50 grayscale-[30%]" : ""}`}
                                >
                                    {v.user?.image ? (
                                        <img src={v.user.image} alt="" className="w-7 h-7 rounded-full" />
                                    ) : (
                                        <div className="w-7 h-7 rounded-full bg-zinc-700" />
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm text-zinc-200 truncate">
                                            <span className="font-medium">{v.user?.name ?? "Anon"}</span>{" "}
                                            {v.value > 0 ? <span className="text-emerald-400">upvoted</span> : <span className="text-red-400">downvoted</span>}
                                        </div>
                                        <div className="text-xs text-zinc-500">{new Date(v.createdAt).toLocaleString()}</div>
                                    </div>
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-md border ${
                                            v.value > 0
                                                ? "text-emerald-300 border-emerald-700/50 bg-emerald-900/30"
                                                : "text-red-300 border-red-700/50 bg-red-900/30"
                                        }`}
                                    >
                    {v.value > 0 ? "Up" : "Down"}
                  </span>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="p-4 text-sm text-zinc-400">No votes yet.</div>
                )}
            </div>
        </div>
    );
}
