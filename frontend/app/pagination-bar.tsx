'use server';

import FancySelect from "@/components/FancySelect";

export default async function PaginationBar({page, totalPages, onPrev, onNext, pageSize, onPageSize, loading,}: {
    page: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
    pageSize: number;
    onPageSize: (n: number) => void;
    loading: boolean;
}) {
    return (
        <section className="flex items-center justify-between text-sm text-zinc-300">
            <span>
            Page <span className="font-medium">{page}</span> / {totalPages}
                {loading ? <span className="ml-2 text-zinc-500">Loading…</span> : null}
            </span>
            <div className="flex items-center gap-3">
                <FancySelect
                    ariaLabel="Page size"
                    widthClass="w-28"
                    value={String(pageSize)}
                    onChange={(v) => onPageSize(Number(v))}
                    options={[
                        {label: "6 / page", value: "6"},
                        {label: "12 / page", value: "12"},
                        {label: "24 / page", value: "24"},
                        {label: "48 / page", value: "48"},
                    ]}
                />
                <div className="flex gap-2">
                    <button
                        className="px-3 py-1 rounded-lg border border-zinc-700 hover:bg-zinc-800 disabled:opacity-50"
                        onClick={onPrev}
                        disabled={page <= 1 || loading}
                    >
                        Prev
                    </button>
                    <button
                        className="px-3 py-1 rounded-lg border border-zinc-700 hover:bg-zinc-800 disabled:opacity-50"
                        onClick={onNext}
                        disabled={page >= totalPages || loading}
                    >
                        Next
                    </button>
                </div>
            </div>
        </section>
    );
}