"use client";

import {useState} from "react";
import {BsFillShareFill} from 'react-icons/bs';
import {IconContext} from "react-icons";

export default function ShareButton({url, title}: {
    url: string;
    title?: string;
    className?: string;
    size?: number;
}) {
    const [copied, setCopied] = useState(false);

    const onShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({url, title});
                return;
            }
        } catch {
        }
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch {
            prompt("Copy this link:", url);
        }
    };

    return (
        <button
            onClick={onShare}
            className={`relative inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-zinc-700 hover:bg-zinc-800/60 active:scale-95 transition cursor-pointer`}
            title={copied ? "Copied!" : "Share"}
            aria-label="Share topic"
        >
            <IconContext.Provider value={{className: "text-zinc-200"}}>
                <BsFillShareFill></BsFillShareFill>
            </IconContext.Provider>
            <span className="hidden sm:block text-xs text-zinc-200">Share</span>
            {copied && (
                <span
                    className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-700 text-emerald-300 shadow">
          Copied!
        </span>
            )}
        </button>
    );
}
