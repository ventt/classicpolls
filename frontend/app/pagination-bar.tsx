'use client';

import FancySelect from "@/components/FancySelect";

export default function PaginationBar({
                                          currentPage,
                                          totalPages,
                                          onPrevAction,
                                          onNextAction,
                                          pageSize,
                                          onPageSizeSelectAction,
                                      }: {
    currentPage: number;
    totalPages: number;
    onPrevAction: () => void;
    onNextAction: () => void;
    pageSize: number;
    onPageSizeSelectAction: (n: number) => void;
}) {
    return (
        <section className="flex items-center justify-between text-sm text-zinc-300">
            <span>
            Page <span className="font-medium">{currentPage}</span> / {totalPages}

            </span>
            <div className="flex items-center gap-3">
                <FancySelect
                    ariaLabel="Page size"
                    widthClass="w-28"
                    value={String(pageSize)}
                    onChange={(v) => onPageSizeSelectAction(Number(v))}
                    options={[
                        {label: "3 / page", value: "3"},
                        {label: "6 / page", value: "6"},
                        {label: "12 / page", value: "12"},
                        {label: "24 / page", value: "24"},
                        {label: "48 / page", value: "48"},
                    ]}
                />
                <div className="flex gap-2">
                    <button
                        className="px-3 py-1 rounded-lg border border-zinc-700 hover:bg-zinc-800 disabled:opacity-50"
                        onClick={onPrevAction}
                        disabled={currentPage <= 1}
                    >
                        Prev
                    </button>
                    <button
                        className="px-3 py-1 rounded-lg border border-zinc-700 hover:bg-zinc-800 disabled:opacity-50"
                        onClick={onNextAction}
                        disabled={currentPage >= totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </section>
    );
}