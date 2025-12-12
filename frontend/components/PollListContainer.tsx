"use client";

import {Suspense, useMemo, useState} from "react";
import {PollDetails} from "@/lib/model/poll-details";
import FancySelect from "@/components/FancySelect";
import PaginationBar from "@/app/pagination-bar";
import {useSearchParams} from "next/navigation";
import LoadingPollCard from "@/components/LoadingPollCard";
import PollList from "@/components/PollList";
import {defaults} from "@/app/poll-details-request-helper";
import {useDebounce} from "use-debounce";


export default function PollListContainer({
                                              initPollDetailsList,
                                              initTotal,
                                              categories,
                                              isUsersList = false,
                                              userSub,
                                          }: {
    initPollDetailsList: PollDetails[],
    initTotal: number,
    categories: string[],
    isUsersList?: boolean,
    userSub?: string,
}) {
    const searchParams = useSearchParams()

    const [total, setTotal] = useState(initTotal);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Search params
    const [limit, setLimit] = useState(Number(searchParams.get('limit')) || defaults.limit);
    const [offset, setOffset] = useState(Number(searchParams.get('offset')) || 0);
    const [orderBy, setOrderBy] = useState<string>(searchParams.get("orderBy") || defaults.orderBy);
    const [categoryName, setCategoryName] = useState<string>(searchParams.get('category') || '');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit])
    const currentPage = useMemo(() => offset / limit + 1, [offset, limit])

    const goPrev = () => setOffset((current) => Math.max(0, current - limit));
    const goNext = () => setOffset((current) => Math.min((totalPages - 1) * limit, current + limit));

    const setOrderByAndResetOffset = (value: string) => {
        setOrderBy(value);
        setOffset(0);
    }

    const setCategoryNameAndResetOffset = (value: string) => {
        setCategoryName(value);
        setOffset(0);
    }


    return (
        <div className="flex lg:max-h-[81vh] flex-col gap-3">
            <section className="flex flex-col md:flex-row gap-2 items-center">
                <input
                    className="flex w-full flex-1 border border-zinc-800 bg-zinc-900 text-zinc-100 rounded-lg px-3 py-2 placeholder:text-zinc-500 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={event => {
                        setOffset(0)
                        setSearchTerm(event.target.value)
                    }}
                />
                <div className="flex gap-2 flex-col w-full md:w-auto md:flex-row">
                    <FancySelect
                        ariaLabel="Filter by category"
                        value={categoryName}
                        onChangeAction={setCategoryNameAndResetOffset}
                        disabled={isLoading}
                        options={[
                            {label: "All categories", value: ''},
                            ...categories.map((c: string) => ({label: c, value: c})),
                        ]}
                    />
                    <FancySelect
                        ariaLabel="Sort polls"
                        value={orderBy}
                        onChangeAction={setOrderByAndResetOffset}
                        disabled={isLoading}
                        options={[
                            {label: "Most popular ↓", value: 'most_popular'},
                            {label: "Least popular ↑", value: 'least_popular'},
                            {label: "Most approved ↓", value: 'most_approved'},
                            {label: "Least approved ↑", value: 'least_approved'},
                            {label: "Most recent ↓", value: 'most_recent'},
                            {label: "Least recent ↑", value: 'least_recent'},
                            {label: "Most upvotes ↓", value: 'most_upvotes'},
                            {label: "Most downvotes ↓", value: 'most_downvotes'},
                        ]}
                    />
                </div>
            </section>

            <PaginationBar
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevAction={goPrev}
                onNextAction={goNext}
                pageSize={limit}
                isLoading={isLoading}
                onPageSizeSelectAction={(n) => {
                    setLimit(n)
                    setOffset(0)
                }}
            />
            {/* Polls */}
            <section
                className="lg:overflow-y-auto lg:pr-1 lg:scrollbar lg:scrollbar-thumb-rounded lg:scrollbar-thumb-emerald-900 lg:scrollbar-track-rounded lg:scrollbar-track-zinc-900">
                <ul className="grid gap-3">
                    <Suspense fallback={<LoadingPollCards limit={limit}/>}>
                        <PollList initPollDetailsList={initPollDetailsList}
                                  limit={limit}
                                  offset={offset}
                                  orderBy={orderBy}
                                  categoryName={categoryName}
                                  userSub={userSub}
                                  searchTerm={debouncedSearchTerm}
                                  isUsersList={isUsersList}
                                  onTotalChangeAction={setTotal}
                                  onLoadingChangeAction={setIsLoading}
                        />
                    </Suspense>
                </ul>
            </section>
            <PaginationBar
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevAction={goPrev}
                onNextAction={goNext}
                pageSize={limit}
                isLoading={isLoading}
                onPageSizeSelectAction={(n) => {
                    setLimit(n)
                    setOffset(0)
                }}
                selection={false}
            />
        </div>
    );
}

function LoadingPollCards({limit}: { limit: number }) {
    return <ul>
        {Array.from({length: limit}).map((_, index) => (
            <LoadingPollCard key={index}/>
        ))}
    </ul>
}
