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
                    value={String(pageSize)}
                    onChangeAction={(v) => onPageSizeSelectAction(Number(v))}
                    options={[
                        {label: "20 / page", value: "20"},
                        {label: "40 / page", value: "40"},
                        {label: "100 / page", value: "100"},
                    ]}
                />
                <div className="flex gap-2">
                    <button
                        className="px-3 py-1 rounded-lg border border-zinc-700 enabled:hover:bg-zinc-800 disabled:opacity-50 cursor-pointer disabled:cursor-default"
                        onClick={onPrevAction}
                        disabled={currentPage <= 1}
                    >
                        Prev
                    </button>
                    <button
                        className="px-3 py-1 rounded-lg border border-zinc-700 enabled:hover:bg-zinc-800 disabled:opacity-50 cursor-pointer disabled:cursor-default"
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