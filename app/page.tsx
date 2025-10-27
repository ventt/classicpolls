"use client";

import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Page() {
    const { data: session, status } = useSession();
    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState<string | undefined>();
    const [sort, setSort] = useState({ by: "ratio", dir: "desc" } as any);
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
        fetch("/api/categories")
            .then((r) => r.json())
            .then(setCategories);
    }, []);

    useEffect(() => {
        fetchData();
    }, [search, categoryId, sort]);

    const handleVote = async (topicId: string, value: number) => {
        const res = await fetch("/api/votes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topicId, value }),
        });
        if (res.ok) fetchData();
    };

    return (
        <div className="min-h-screen grid grid-cols-12 gap-4 p-4 bg-gray-50">
            {/* BAL oldali reklám */}
            <aside className="hidden lg:block col-span-2 sticky top-4 h-[80vh] border rounded-lg flex items-center justify-center bg-white">
                Reklám
            </aside>

            {/* TARTALOM */}
            <main className="col-span-12 lg:col-span-8 flex flex-col gap-4">
                {/* FEJLÉC */}
                <header className="flex items-center justify-between border-b pb-3">
                    <h1 className="text-3xl font-bold text-indigo-700">WowVotes</h1>
                    {isLoading ? (
                        <div>Betöltés...</div>
                    ) : session ? (
                        <div className="flex items-center gap-3">
                            <img
                                src={session.user?.image ?? ""}
                                alt="avatar"
                                className="w-8 h-8 rounded-full"
                            />
                            <span className="font-medium">{session.user?.name}</span>
                            <button
                                className="px-3 py-1 border rounded hover:bg-gray-100"
                                onClick={() => signOut()}
                            >
                                Kilépés
                            </button>
                        </div>
                    ) : (
                        <button
                            className="px-3 py-1 border rounded bg-indigo-600 text-white hover:bg-indigo-700"
                            onClick={() => signIn("discord")}
                        >
                            Discord belépés
                        </button>
                    )}
                </header>

                {/* KERESŐ + SZŰRŐ */}
                <section className="flex flex-wrap gap-2 items-center">
                    <input
                        className="border rounded px-3 py-2 flex-1"
                        placeholder="Keresés…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="border rounded px-3 py-2"
                        value={categoryId || ""}
                        onChange={(e) =>
                            setCategoryId(e.target.value || undefined)
                        }
                    >
                        <option value="">Összes kategória</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                    <select
                        className="border rounded px-3 py-2"
                        value={`${sort.by}:${sort.dir}`}
                        onChange={(e) => {
                            const [by, dir] = e.target.value.split(":");
                            setSort({ by, dir });
                        }}
                    >
                        <option value="ratio:desc">Pozitív arány ↓ (alap)</option>
                        <option value="ratio:asc">Pozitív arány ↑</option>
                        <option value="popularity:desc">Népszerűség ↓</option>
                        <option value="popularity:asc">Népszerűség ↑</option>
                        <option value="positive:desc">Pozitív szavazat ↓</option>
                        <option value="negative:desc">Negatív szavazat ↓</option>
                    </select>
                </section>

                {/* ÚJ TOPIC FORM */}
                {session && (
                    <TopicForm categories={categories} onCreated={fetchData} />
                )}

                {/* TOPIC LISTA */}
                <ul className="grid gap-3">
                    {topics.map((t) => (
                        <li
                            key={t.id}
                            className="border rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">{t.title}</h3>
                                    <p className="text-sm opacity-80">
                                        {t.category?.name}
                                    </p>
                                </div>
                                {session && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="px-2 py-1 border rounded text-green-700 hover:bg-green-100"
                                            onClick={() => handleVote(t.id, 1)}
                                        >
                                            👍
                                        </button>
                                        <button
                                            className="px-2 py-1 border rounded text-red-700 hover:bg-red-100"
                                            onClick={() => handleVote(t.id, -1)}
                                        >
                                            👎
                                        </button>
                                    </div>
                                )}
                            </div>
                            {t.description && (
                                <p className="text-sm mt-2">{t.description}</p>
                            )}
                            <div className="text-xs mt-2 opacity-70">
                                👍 {t.stats.pos} | 👎 {t.stats.neg} | arány{" "}
                                {(t.stats.ratio * 100).toFixed(0)}%
                            </div>
                        </li>
                    ))}
                </ul>
            </main>

            {/* JOBB oldali reklám */}
            <aside className="hidden lg:block col-span-2 sticky top-4 h-[80vh] border rounded-lg flex items-center justify-center bg-white">
                Reklám
            </aside>
        </div>
    );
}

// ÚJ TOPIC létrehozása
function TopicForm({
                       categories,
                       onCreated,
                   }: {
    categories: any[];
    onCreated: () => void;
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");

    const submit = async () => {
        if (!title || !categoryId) return alert("Töltsd ki a címet és kategóriát!");
        await fetch("/api/topics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description, categoryId }),
        });
        setTitle("");
        setDescription("");
        onCreated();
    };

    return (
        <div className="border rounded-lg p-3 flex flex-wrap gap-2 items-center bg-white shadow-sm">
            <input
                className="border rounded px-3 py-2 flex-[2] min-w-[200px]"
                placeholder="Új topic címe"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                className="border rounded px-3 py-2 flex-[3] min-w-[200px]"
                placeholder="Leírás (opcionális)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <select
                className="border rounded px-3 py-2"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
            >
                <option value="" disabled>
                    Válassz kategóriát
                </option>
                {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                        {c.name}
                    </option>
                ))}
            </select>
            <button
                className="px-3 py-2 border rounded bg-indigo-600 text-white hover:bg-indigo-700"
                onClick={submit}
            >
                Indítás
            </button>
        </div>
    );
}
