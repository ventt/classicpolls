"use client";

import {useState} from "react";

export default function ShareButton({url, title, className = "", size = 18,}: {
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
            className={`relative inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-zinc-700 hover:bg-zinc-800/60 active:scale-95 transition cursor-pointer ${className}`}
            title={copied ? "Copied!" : "Share"}
            aria-label="Share topic"
        >
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="text-zinc-200">
                <path
                    d="M18 8a3 3 0 10-2.83-4H15a3 3 0 102.12 5.12L9.91 12.1a3 3 0 100 1.8l7.21 3.0A3 3 0 1018 16a2.99 2.99 0 00-2.12.88l-7.21-3a3 3 0 000-1.76l7.21-3A2.99 2.99 0 0018 8z"
                    fill="currentColor"/>
            </svg>
            <span className="text-xs text-zinc-200">Share</span>

            {copied && (
                <span
                    className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-700 text-emerald-300 shadow">
          Copied!
        </span>
            )}
        </button>
    );
}
