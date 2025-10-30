"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import FancySelect from "@/components/FancySelect";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";


const TITLE_LIMIT = 75;
const MIN_DESCRIPTION_LENGTH = 30;

export default function NewPollForm({categories}: {
    categories: string[]
}) {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [markDownDescription, setMarkDownDescription] = useState(`
# GFM

## Autolink literals

www.example.com, https://example.com, and contact@example.com.

## Footnote

A note[^1]

[^1]: Big note.

## Strikethrough

~one~ or ~~two~~ tildes.

## Table

| a | b  |  c |  d  |
| - | :- | -: | :-: |
| 1 | 2  |  3 |  4  |
| 5 | 6  |  7 |  8  |
| 9 | 10 | 11 | 12  |

## Tasklist

* [ ] to do
* [x] done
    `);
    const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
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
        if (markDownDescription.length < MIN_DESCRIPTION_LENGTH) {
            setErr(`Description must be at least ${MIN_DESCRIPTION_LENGTH} characters.`);
            return;
        }
        if (!selectedCategoryName.length) {
            setErr("Please select a category!");
            return;
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
                Description
            </label>
            <textarea
                className="border border-zinc-800 bg-zinc-900 text-zinc-100 rounded-lg px-3 py-2 min-h-[100px]"
                placeholder="Brief description..."
                value={markDownDescription}
                onChange={(e) => setMarkDownDescription(e.target.value)}
            />

            <label className="text-sm font-medium text-zinc-300">
                Preview
            </label>
            <article className="prose md:prose-lg lg:prose-xl text-white">
                <Markdown remarkPlugins={[remarkGfm]}>{markDownDescription}</Markdown>
            </article>

            <label className="text-sm font-medium text-zinc-300">Category</label>
            <FancySelect
                ariaLabel="Select category"
                value={selectedCategoryName}
                onChangeAction={(val: string) => setSelectedCategoryName(val)}
                options={[
                    {label: "Select category", value: ''},
                    ...categories.map((c: string) => ({label: c, value: c})),
                ]}
            />

            <div className="flex gap-2 mt-2">
                <button
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 transition text-white cursor-pointer"
                    onClick={submit}
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Create"}
                </button>
                <button
                    className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition text-white cursor-pointer"
                    onClick={() => history.back()}
                    type="button"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

