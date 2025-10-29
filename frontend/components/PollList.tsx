"use client";

import {useEffect, useMemo, useState} from "react";
import PollCard from "@/components/PollCard";
import {PollDetails} from "@/lib/model/poll-details";
import FancySelect from "@/components/FancySelect";
import PaginationBar from "@/app/pagination-bar";
import {fetchPollsDetails} from "@/app/actions";

enum OrderBy {
    UpvoteRatio = "upvote_ratio",
    ApprovalScore = "approval_score",
}

export default function PollList({initPollDetailsList, loggedIn, initTotal, initPageSize, categories}: {
    initPollDetailsList: PollDetails[];
    loggedIn: boolean;
    initTotal: number;
    initPageSize: number;
    categories: string[]
}) {
    const [polls, setPolls] = useState<PollDetails[]>(initPollDetailsList);

    const [total, setTotal] = useState(initTotal);
    const [limit, setLimit] = useState(initPageSize);
    const [offset, setOffset] = useState(0);
    const [orderBy, setOrderBy] = useState<OrderBy>(OrderBy.ApprovalScore);
    const [ascending, setAscending] = useState(false);

    useEffect(() => {
        fetchPollsDetails(limit, offset, orderBy, ascending).then(response => {
            setPolls(response.data);
            setTotal(response.count);
        })
    }, [limit, offset, orderBy, ascending]);

    const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit])
    const currentPage = useMemo(() => offset / limit + 1, [offset, limit])

    const [selectedCategoryName, setSelectedCategoryName] = useState<string>();

    const goPrev = () => setOffset((current) => Math.max(0, current - limit));
    const goNext = () => setOffset((current) => Math.min((totalPages - 1) * limit, current + limit));

    return (
        <>

            <section className="flex flex-wrap gap-2 items-center">
                <input
                    className="border border-zinc-800 bg-zinc-900 text-zinc-100 rounded-lg px-3 py-2 flex-1 placeholder:text-zinc-500"
                    placeholder="Search..."
                    value=""
                    readOnly={true}
                />
                <FancySelect
                    ariaLabel="Filter by category"
                    widthClass="w-56"
                    value={selectedCategoryName || ""}
                    onChange={(val) => setSelectedCategoryName(val || undefined)}
                    options={[
                        {label: "All categories", value: ""},
                        ...categories.map((c: string) => ({label: c, value: c})),
                    ]}
                />
                <FancySelect
                    ariaLabel="Sort topics"
                    widthClass="w-56"
                    value=""
                    onChange={(v) => {
                    }}
                    options={[
                        {label: "Most approved ↓ (default)", value: "ratio:desc"},
                        {label: "Least approved ↑", value: "ratio:asc"},
                        {label: "Most popular ↓", value: "popularity:desc"},
                        {label: "Least popular ↑", value: "popularity:asc"},
                        {label: "Most upvotes ↓", value: "positive:desc"},
                        {label: "Most downvotes ↓", value: "negative:desc"},
                    ]}
                />
            </section>
            <PaginationBar
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevAction={goPrev}
                onNextAction={goNext}
                pageSize={limit}
                onPageSizeSelectAction={(n) => {
                    setLimit(n)
                    setOffset(0)
                }}
            />
            {/* TOPICS*/}
            <section className="max-h-[65vh] overflow-y-auto pr-1 fancy-scrollbar">
                <ul className="grid gap-3">
                    {polls.map((t) => (
                        <PollCard
                            key={t.id}
                            pollDetails={t}
                            loggedIn={loggedIn}
                        />
                    ))}
                    {!polls.length && (
                        <li className="text-zinc-400 text-sm">No topics found.</li>
                    )}
                </ul>
            </section>
            <PaginationBar
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevAction={goPrev}
                onNextAction={goNext}
                pageSize={limit}
                onPageSizeSelectAction={(n) => {
                    setLimit(n)
                    setOffset(0)
                }}
            />
        </>
    );
}
