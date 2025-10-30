"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import FancySelect from "@/components/FancySelect";

type Category = { id: string; name: string };
const TITLE_LIMIT = 75;

export default function NewTopicForm({category}: { category: string }) {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState<string>(category);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const submit = async () => {
        setErr(null);

        if (!title) {
            setErr("Please fill in the title!");
            return;
        }
        if (title.length > TITLE_LIMIT) {
            setErr(`Title must be ${TITLE_LIMIT} characters or fewer.`);
            return;
        }
        if (!categoryId) {
            setErr("Please select a category!");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/topics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, categoryId }),
            });
            const j = await res.json().catch(() => null);
            if (!res.ok) {
                setErr(j?.error ?? `${res.status} ${res.statusText}`);
                return;
            }
            router.push("/");
            router.refresh();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            {err && <div className="text-red-400 text-sm">{err}</div>}
            <label className="text-sm font-medium text-zinc-300 flex justify-between items-center">
                <span>Title</span>
                <span className={`text-xs ${title.length > TITLE_LIMIT ? "text-red-400" : "text-zinc-500"}`}>
          {title.length} / {TITLE_LIMIT}
        </span>
            </label>
            <input
                className={`border rounded-lg px-3 py-2 bg-zinc-900 text-zinc-100 border-zinc-800 focus:outline-none focus:ring-1 ${
                    title.length > TITLE_LIMIT ? "border-red-600 focus:ring-red-600" : "focus:ring-indigo-500"
                }`}
                placeholder="Enter topic title"
                value={title}
                maxLength={TITLE_LIMIT + 1}
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
                ariaLabel="Select category"
                value={categoryId}
                onChangeAction={(val: string) => setCategoryId(val)}
                options={[]} //
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

