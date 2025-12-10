'use client';

import FancySelect from "@/components/FancySelect";

export default function PaginationBar({
                                          currentPage,
                                          totalPages,
                                          onPrevAction,
                                          onNextAction,
                                          pageSize,
                                          onPageSizeSelectAction,
                                          selection = true,
                                          isLoading = false,
                                      }: {
    currentPage: number;
    totalPages: number;
    onPrevAction: () => void;
    onNextAction: () => void;
    pageSize: number;
    onPageSizeSelectAction: (n: number) => void;
    selection?: boolean;
    isLoading?: boolean;
}) {
    return (
        <section className="flex items-center justify-between text-sm text-zinc-300">
            {isLoading ? (
                <div
                    className=" animate-pulse font-semibold text-lg text-white truncate w-20 h-4 rounded bg-gray-600"></div>
            ) : (
                <span>Page <span className="font-medium">{currentPage}</span> / {totalPages}</span>
            )}


            <div className="flex items-center gap-3">
                {selection && (
                    <FancySelect
                        ariaLabel="Page size"
                        value={String(pageSize)}
                        onChangeAction={(v) => onPageSizeSelectAction(Number(v))}
                        disabled={isLoading}
                        options={[
                            {label: "20 / page", value: "20"},
                            {label: "40 / page", value: "40"},
                            {label: "100 / page", value: "100"},
                        ]}
                    />
                )}

                <div className="flex gap-2">
                    <button
                        className="px-3 py-1 rounded-lg border border-zinc-700 enabled:hover:bg-zinc-800 disabled:opacity-50 cursor-pointer disabled:cursor-default"
                        onClick={onPrevAction}
                        disabled={currentPage <= 1 || isLoading}
                    >
                        Prev
                    </button>
                    <button
                        className="px-3 py-1 rounded-lg border border-zinc-700 enabled:hover:bg-zinc-800 disabled:opacity-50 cursor-pointer disabled:cursor-default"
                        onClick={onNextAction}
                        disabled={currentPage >= totalPages || isLoading}
                    >
                        Next
                    </button>
                </div>
            </div>
        </section>
    );
}