"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

type Item = {
    id: string;
    title: string;
    description: string | null;
    createdAt: string;
    category: { name: string } | null;
    stats: { pos: number; neg: number; total: number; ratio: number };
};

export default function MyTopicsPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [err, setErr] = useState<string | null>(null);

    async function load() {
        setLoading(true);
        setErr(null);
        try {
            const res = await fetch("/api/my-topics", { cache: "no-store" });
            const j = await res.json();
            if (!res.ok) throw new Error(j?.error || "Failed to load topics");
            setItems(j.items || []);
        } catch (e: any) {
            setErr(e.message || "Failed to load topics");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function handleDelete(id: string) {
        if (!confirm("Delete this topic? This cannot be undone.")) return;
        setDeleting(id);
        try {
            const res = await fetch(`/api/topics/${id}`, { method: "DELETE" });
            if (!res.ok && res.status !== 204) {
                const j = await res.json().catch(() => null);
                throw new Error(j?.error || "Failed to delete");
            }
            setItems((prev) => prev.filter((t) => t.id !== id)); // remove immediately
        } catch (e: any) {
            alert(e.message || "Failed to delete");
        } finally {
            setDeleting(null);
        }
    }

    return (
        <div className="min-h-screen flex flex-col gap-4 p-4 max-w-5xl mx-auto">
            <SiteHeader />

            <div className="flex items-center justify-between mt-2">
                <h2 className="text-xl font-semibold text-white">My Topics</h2>
                <Link
                    href="/new-topic"
                    className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition"
                >
                    New Topic
                </Link>
            </div>

            {err && <div className="text-sm text-red-400">{err}</div>}
            {loading ? (
                <div className="text-zinc-400 text-sm">Loading…</div>
            ) : items.length === 0 ? (
                <div className="text-zinc-400 text-sm">
                    You haven’t created any topics yet.
                </div>
            ) : (
                <ul className="grid gap-3">
                    {items.map((t) => (
                        <li
                            key={t.id}
                            className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/60"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <Link
                                        href={`/topic/${t.id}`}
                                        className="font-semibold text-lg text-white hover:underline"
                                    >
                                        {t.title}
                                    </Link>
                                    <p className="text-sm text-zinc-400">
                                        {t.category?.name} •{" "}
                                        {new Date(t.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDelete(t.id)}
                                    disabled={deleting === t.id}
                                    className="px-3 py-1 rounded-lg border border-red-700/60 bg-red-900/30 hover:bg-red-800/40 disabled:opacity-50 transition text-red-200"
                                    title="Delete topic"
                                >
                                    {deleting === t.id ? "Deleting…" : "Delete"}
                                </button>
                            </div>

                            {t.description && (
                                <p className="mt-2 text-sm text-zinc-300 line-clamp-3">
                                    {t.description}
                                </p>
                            )}

                            <div className="mt-2 text-xs text-zinc-400">
                                {t.stats.total
                                    ? `${Math.round(
                                        (t.stats.pos / t.stats.total) * 100
                                    )}% positive • ${t.stats.pos} up / ${t.stats.neg} down • ${
                                        t.stats.total
                                    } votes`
                                    : "No votes yet"}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
