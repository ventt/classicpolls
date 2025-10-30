"use client";

import {useEffect, useMemo, useState} from "react";
import PollCard from "@/components/PollCard";
import {PollDetails} from "@/lib/model/poll-details";
import FancySelect from "@/components/FancySelect";
import PaginationBar from "@/app/pagination-bar";
import {fetchPollsDetails} from "@/app/actions";

enum OrderBy {
    Upvotes = "upvotes",
    Downvotes = "downvotes",
    ApprovalScore = "approval_score",
    TotalVotes = "total_votes",
}

const OrderByMap = new Map<string, { orderBy: OrderBy; ascending: boolean }>([
    ['most_approved', {orderBy: OrderBy.ApprovalScore, ascending: false}],
    ['least_approved', {orderBy: OrderBy.ApprovalScore, ascending: true}],
    ['most_popular', {orderBy: OrderBy.TotalVotes, ascending: false}],
    ['least_popular', {orderBy: OrderBy.TotalVotes, ascending: true}],
    ['most_upvotes', {orderBy: OrderBy.Upvotes, ascending: false}],
    ['most_downvotes', {orderBy: OrderBy.Downvotes, ascending: false}],
]);


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

    const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');
    const [selectedOrderBy, setSelectedOrderBy] = useState<string>('most_approved');
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        const category = selectedCategoryName == '' ? null : selectedCategoryName;
        fetchPollsDetails(
            limit,
            offset,
            orderBy,
            ascending,
            category,
            searchTerm == '' ? null : searchTerm
        ).then(response => {
            setPolls(response.data);
            setTotal(response.count);
        })
    }, [limit, offset, orderBy, ascending, selectedCategoryName, searchTerm]);

    const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit])
    const currentPage = useMemo(() => offset / limit + 1, [offset, limit])

    const goPrev = () => setOffset((current) => Math.max(0, current - limit));
    const goNext = () => setOffset((current) => Math.min((totalPages - 1) * limit, current + limit));

    return (
        <>

            <section className="flex flex-wrap gap-2 items-center">
                <input
                    className="border border-zinc-800 bg-zinc-900 text-zinc-100 rounded-lg px-3 py-2 flex-1 placeholder:text-zinc-500"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={event => setSearchTerm(event.target.value)}
                />
                <FancySelect
                    ariaLabel="Filter by category"
                    value={selectedCategoryName}
                    onChange={setSelectedCategoryName}
                    options={[
                        {label: "All categories", value: ''},
                        ...categories.map((c: string) => ({label: c, value: c})),
                    ]}
                />
                <FancySelect
                    ariaLabel="Sort topics"
                    value={selectedOrderBy}
                    onChange={(val: string) => {
                        const order = OrderByMap.get(val)
                        if (order) {
                            setOrderBy(order.orderBy)
                            setAscending(order.ascending)
                            setSelectedOrderBy(val)
                        }
                    }}
                    options={[
                        {label: "Most approved ↓ (default)", value: 'most_approved'},
                        {label: "Least approved ↑", value: 'least_approved'},
                        {label: "Most popular ↓", value: 'most_popular'},
                        {label: "Least popular ↑", value: 'least_popular'},
                        {label: "Most upvotes ↓", value: 'most_upvotes'},
                        {label: "Most downvotes ↓", value: 'most_downvotes'},
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
