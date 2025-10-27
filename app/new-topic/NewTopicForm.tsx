"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FancySelect from "@/components/FancySelect";

type Category = { id: string; name: string };

export default function NewTopicForm({ categories }: { categories: Category[] }) {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const submit = async () => {
        setErr(null);
        if (!title || !categoryId) {
            setErr("Please fill in the title and category!");
            return;
        }
        setLoading(true);
        const res = await fetch("/api/topics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description, categoryId }),
        });
        setLoading(false);

        if (!res.ok) {
            const j = await res.json().catch(() => ({}));
            setErr(j?.error ?? "Saving failed");
            return;
        }
        router.push("/");
        router.refresh();
    };


    return (
        <div className="flex flex-col gap-3">
            {err && <div className="text-red-400 text-sm">{err}</div>}

            <label className="text-sm font-medium text-zinc-300">Title</label>
            <input
                className="border border-zinc-800 bg-zinc-900 text-zinc-100 rounded-lg px-3 py-2"
                placeholder="Enter topic title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <label className="text-sm font-medium text-zinc-300">
                Description <span className="opacity-60">(optional)</span>
            </label>
            <textarea
                className="border border-zinc-800 bg-zinc-900 text-zinc-100 rounded-lg px-3 py-2 min-h-[100px]"
                placeholder="Brief description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <label className="text-sm font-medium text-zinc-300">Category</label>
            <FancySelect
                ariaLabel="Filter by category"
                widthClass="w-56"
                value={categoryId || ""}
                // @ts-ignore
                onChange={(val) => setCategoryId(val || undefined)}
                options={[
                    { label: "All categories", value: "" },
                    ...categories.map((c: any) => ({ label: c.name, value: c.id })),
                ]}
            />

            <div className="flex gap-2 mt-2">
                <button
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60"
                    onClick={submit}
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Create"}
                </button>
                <button
                    className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800"
                    onClick={() => history.back()}
                    type="button"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
