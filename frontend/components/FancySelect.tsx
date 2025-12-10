'use client';

import {useEffect, useMemo, useRef, useState} from "react";
import {cn} from "@/lib/utils";

type Option = { label: string; value: string }; // changed: value is now string

export default function FancySelect({
                                        value,
                                        onChangeAction,
                                        options,
                                        placeholder = "Select…",
                                        className,
                                        ariaLabel,
                                        openUp = false,
                                        disabled = false,
                                    }: {
    value?: string;
    onChangeAction: (val: string) => void;
    options: Option[];
    placeholder?: string;
    className?: string;
    ariaLabel?: string;
    openUp?: boolean;
    disabled?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const btnRef = useRef<HTMLButtonElement | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    const selected = useMemo(
        () => options.find((o) => o.value === value) || null,
        [options, value]
    );

    // kívülre kattintás
    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (!open) return;
            const target = e.target as Node;
            if (!btnRef.current?.contains(target) && !listRef.current?.contains(target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, [open]);

    // billentyűzet kezelés
    function onKeyDown(e: React.KeyboardEvent) {
        if (!open) {
            if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpen(true);
                setActiveIndex(Math.max(0, options.findIndex((o) => o.value === value)));
            }
            return;
        }
        if (e.key === "Escape") {
            e.preventDefault();
            setOpen(false);
            btnRef.current?.focus();
            return;
        }
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(options.length - 1, (i === -1 ? 0 : i + 1)));
        }
        if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(0, (i === -1 ? 0 : i - 1)));
        }
        if (e.key === "Enter") {
            e.preventDefault();
            const opt = options[activeIndex];
            if (opt) {
                onChangeAction(opt.value);
                setOpen(false);
                btnRef.current?.focus();
            }
        }
    }

    return (
        <div className="flex relative w-full md:w-56" onKeyDown={onKeyDown}>
            <button
                ref={btnRef}
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={ariaLabel}
                disabled={disabled}
                onClick={() => setOpen((o) => !o)}
                className={cn(
                    "flex w-full min-w-0 items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-100 px-3 py-2 gap-2 enabled:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-800 cursor-pointer disabled:text-gray-600 disabled:cursor-not-allowed",
                    className,
                )}
            >
            <span className={cn("min-w-0 flex-1 truncate text-left", selected ? "" : "text-zinc-500")}>
              {selected ? selected.label : placeholder}
            </span>
                <svg width="16" height="16" viewBox="0 0 24 24" className="text-zinc-400 shrink-0">
                    <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                          strokeLinejoin="round"/>
                </svg>
            </button>

            {open && (
                <div
                    ref={listRef}
                    role="listbox"
                    className={cn(
                        "absolute z-50 mt-2 max-h-64 overflow-auto rounded-lg border border-zinc-800 bg-zinc-900 shadow-xl w-full scrollbar scrollbar-thumb-rounded scrollbar-thumb-emerald-900 scrollbar-track-rounded scrollbar-track-zinc-900",
                        openUp ? "bottom-full mb2" : ""
                    )}
                >
                    {options.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-zinc-500">No options</div>
                    ) : (
                        options.map((opt, i) => {
                            const isSelected = opt.value === value;
                            const isActive = i === activeIndex;
                            return (
                                <button
                                    key={opt.value}
                                    role="option"
                                    aria-selected={isSelected}
                                    type="button"
                                    onMouseEnter={() => setActiveIndex(i)}
                                    onClick={() => {
                                        onChangeAction(opt.value);
                                        setOpen(false);
                                        btnRef.current?.focus();
                                    }}
                                    className={cn(
                                        "w-full text-left px-3 py-2 text-sm flex items-center justify-between cursor-pointer",
                                        isActive ? "bg-zinc-800" : "",
                                        isSelected ? "text-white" : "text-zinc-200"
                                    )}
                                >
                                    <span className="min-w-0 flex-1 truncate">{opt.label}</span>
                                    {isSelected ? (
                                        <svg width="16" height="16" viewBox="0 0 24 24"
                                             className="text-emerald-800 shrink-0">
                                            <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2"
                                                  strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    ) : null}
                                </button>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
