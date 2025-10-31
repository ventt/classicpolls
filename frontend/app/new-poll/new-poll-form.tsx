"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import FancySelect from "@/components/FancySelect";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {createNewPoll, lintPollDescription} from "@/app/new-poll/actions";


const TITLE_MAX = 75;
const TITLE_MIN = 10;
const MIN_DESCRIPTION_LENGTH = 30;

export default function NewPollForm({categories}: {
    categories: string[]
}) {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [markDownDescription, setMarkDownDescription] = useState(`
## 👋 Welcome to the GitHub Markdown Mini-Guide

Hi there! This short guide shows a few basics of GitHub-flavored Markdown.

### ✨ Basic Formatting

**Bold text**  
*Italic text*  
~~Strikethrough~~

### 📋 Lists

- Item 1
- Item 2
  - Sub-item

1. First
2. Second

### 🧱 Blockquote Guide

Blockquotes are used to highlight notes, tips, or quoted text.

Write a blockquote by starting a line with \`>\`:

> This is a blockquote!
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
        if (title.length > TITLE_MAX) {
            setErr(`Title must be ${TITLE_MAX} characters or fewer.`);
            return;
        }
        if (title.length < TITLE_MIN) {
            setErr(`Title must be at least ${TITLE_MIN} characters.`);
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

        try {
            setLoading(true);

            const lintErrors = await lintPollDescription(markDownDescription);

            if (lintErrors.length) {
                setErr(`Description has the following issues:\n\n${lintErrors.join('\n')}`);
                setLoading(false);
                return;
            }

            if (!confirm("Are you sure you want to create this poll? You CAN NOT edit it later")) {
                setLoading(false);
                return;
            }

            const pollId: string = await createNewPoll(title, markDownDescription, selectedCategoryName);

            router.push(`/poll/${pollId}`);
        } catch (e) {
            setErr(e instanceof Error ? e.message : 'An error occurred while creating the poll.');
            setLoading(false);
            return
        }
    };

    return (
        <div className="flex flex-col gap-3">
            {err && <div className="text-red-400 text-sm">{err}</div>}
            <label className="text-sm font-medium text-zinc-300 flex justify-between items-center">
                <span>Title</span>
                <span className={`text-xs ${title.length > TITLE_MAX ? "text-red-400" : "text-zinc-500"}`}>
          {title.length} / {TITLE_MAX}
        </span>
            </label>
            <input
                className={`border rounded-lg px-3 py-2 bg-zinc-900 text-zinc-100 border-zinc-800 focus:outline-none focus:ring-1 ${
                    title.length > TITLE_MAX ? "border-red-600 focus:ring-red-600" : "focus:ring-indigo-500"
                }`}
                placeholder="Enter topic title"
                value={title}
                maxLength={TITLE_MAX + 1}
                onChange={(e) => setTitle(e.target.value)}
            />

            <label className="text-sm font-medium text-zinc-300">
                Description (<a target="_blank" rel="noopener noreferrer"
                                className="text-zinc-500 hover:text-emerald-300"
                                href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet/7cbbd78fe93a3342f04fdd0e00a6a6ec5627a18e">Markdown
                cheatsheat</a>)
            </label>
            <textarea
                className="border border-zinc-800 bg-zinc-900 text-zinc-100 rounded-lg px-3 py-2 max-h-64 h-64"
                placeholder="Brief description..."
                value={markDownDescription}
                onChange={(e) => setMarkDownDescription(e.target.value)}
            />

            <label className="text-sm font-medium text-zinc-300">
                Preview
            </label>
            <div
                className="h-64 w-f overflow-y-auto scrollbar scrollbar-thumb-rounded scrollbar-thumb-emerald-900 scrollbar-track-rounded scrollbar-track-zinc-900 border  rounded-lg border-zinc-800 p-6 backdrop-blur-sm">
                <article
                    className="prose prose-sm prose-slate prose-invert">
                    <Markdown remarkPlugins={[remarkGfm]}>{markDownDescription}</Markdown>
                </article>
            </div>


            <label className="text-sm font-medium text-zinc-300">Category</label>
            <FancySelect
                ariaLabel="Select category"
                value={selectedCategoryName}
                onChangeAction={(val: string) => setSelectedCategoryName(val)}
                openUp={true}
                options={[
                    {label: "Select category", value: ''},
                    ...categories.map((c: string) => ({label: c, value: c})),
                ]}
            />

            <div className="flex gap-2 mt-2">
                <button
                    className="px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-600 disabled:opacity-60 transition text-white cursor-pointer"
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

