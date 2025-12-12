"use client";

import {useEffect, useRef, useState} from "react";
import PollCard from "@/components/PollCard";
import {PollDetails} from "@/lib/model/poll-details";
import {SessionProvider} from "next-auth/react";
import {deletePoll} from "@/app/my-polls/my-polls";
import {OrderByOptions} from "@/app/poll-details-request-helper";
import LoadingPollCard from "@/components/LoadingPollCard";
import useSWR from "swr";
import {cn} from "@/lib/utils";

type PollsResponse = {
    data: PollDetails[];
    count: number;
};

const fetcher = (url: string) =>
    fetch(url).then(res => {
        if (!res.ok) throw new Error("Failed to fetch polls");
        return res.json();
    });

export default function PollList({
                                     initPollDetailsList,
                                     isUsersList = false,
                                     onTotalChangeAction,
                                     onLoadingChangeAction,
                                     userSub,
                                     limit,
                                     offset,
                                     orderBy,
                                     categoryName,
                                     searchTerm,
                                 }: {
    initPollDetailsList: PollDetails[],
    isUsersList?: boolean,
    userSub?: string,

    // Search params
    limit: number,
    offset: number,
    orderBy: string,
    categoryName?: string,
    searchTerm?: string,

    onTotalChangeAction?: (total: number) => void,
    onLoadingChangeAction?: (loading: boolean) => void,
}) {
    const scrollRef = useRef<HTMLUListElement>(null);

    const [updatedPolls, setUpdatedPolls] = useState<PollDetails[]>([]);

    // ------- SWR: main polls fetch --------
    const category = categoryName === "" ? undefined : categoryName;
    const orderByOption = OrderByOptions.get(orderBy)!;

    const searchParams = new URLSearchParams();
    searchParams.set("limit", limit.toString());
    searchParams.set("offset", offset.toString());
    searchParams.set("orderBy", orderByOption.orderBy);
    searchParams.set("asc", orderByOption.ascending.toString());
    if (category) {
        searchParams.set("category", category);
    }
    if (searchTerm && searchTerm !== "") {
        searchParams.set("searchTerm", searchTerm);
    }
    if (isUsersList && userSub) {
        searchParams.set("user_sub", userSub);
    }

    const pollsUrl = `/api/poll-details?${searchParams.toString()}`;

    const {
        data,
        error,
        isLoading,
        isValidating,
        mutate,
    } = useSWR<PollsResponse>(
        pollsUrl,
        fetcher,
        {
            fallbackData: {
                data: initPollDetailsList,
                count: initPollDetailsList.length,
            },
            revalidateOnFocus: false,
        }
    );

    const polls = data?.data ?? [];

    // ------- External loading callback -------
    useEffect(() => {
        if (onLoadingChangeAction) {
            onLoadingChangeAction(isLoading);
        }
    }, [isLoading, onLoadingChangeAction]);

    // ------- External total callback -------
    useEffect(() => {
        if (data && onTotalChangeAction) {
            onTotalChangeAction(data.count);
        }
    }, [data, onTotalChangeAction]);

    // ------- Scroll to top when finished loading -------
    useEffect(() => {
        if (data) {
            const hash = window.location.hash;
            if (hash && window?.innerWidth >= 1024) {
                // Only auto-scroll to the top element on large screens, because the overflow is on the ul element
                setTimeout(() => {
                        const element = document.getElementById(hash.substring(1));
                        if (element) {
                            console.log("Scrolling to element with id:", hash.substring(1));
                            element.scrollIntoView({behavior: "smooth"});

                            // Remove hash from url without reloading
                            history.replaceState(null, "", window.location.pathname + window.location.search);
                        }
                    }
                    , 500);

            } else if (window?.innerWidth >= 1024) {
                // Only auto-scroll to the top element on large screens (lg and up)
                scrollRef.current?.children.item(0)?.scrollIntoView();
            } else {
                // Scroll to the top of the window on smaller screens
                window.scrollTo({top: 0});
            }
        }
    }, [data]);

    // ------- Update URL search params when search params / data change -------
    useEffect(() => {
        if (!data) return;

        const url = new URL(window.location.href);
        url.searchParams.set("limit", limit.toString());
        url.searchParams.set("offset", offset.toString());
        url.searchParams.set("orderBy", orderBy);

        if (categoryName) {
            url.searchParams.set("category", categoryName);
        } else {
            url.searchParams.delete("category");
        }

        if (searchTerm) {
            url.searchParams.set("search", searchTerm);
        } else {
            url.searchParams.delete("search");
        }

        window.history.replaceState({}, "", url.toString());
    }, [data, limit, offset, orderBy, categoryName, searchTerm]);

    // ------- Error handling (similar to original catch) -------
    useEffect(() => {
        if (!error) return;
        if (window.confirm("Ooops :( Sorry, there was an error on the page, do you want to reload?")) {
            window.location.reload();
        }
    }, [error]);

    // ------- Auto-refresh visible polls -------
    const [visiblePollIds, setVisiblePollIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (visiblePollIds.size && !isLoading) {
                fetch("/api/poll-updates?poll_ids=" + Array.from(visiblePollIds).join(","))
                    .then(res => {
                        if (res.ok) {
                            res.json().then(setUpdatedPolls);
                        }
                    })
                    .catch(() => {
                        // Swallow errors here, just like before
                    });
            }
        }, 60 * 1000);

        return () => clearInterval(intervalId);
    }, [visiblePollIds, isLoading]);

    const onVisibilityChange = (inView: boolean, pollId: string) => {
        setVisiblePollIds(prev => {
            const next = new Set(prev);
            if (inView) {
                next.add(pollId);
            } else {
                next.delete(pollId);
            }
            return next;
        });
    };

    const onDelete = (pollId: string) => {
        deletePoll(pollId).then(() => {
            // Optimistically update SWR cache
            mutate(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    data: prev.data.filter(poll => poll.id !== pollId),
                    count: prev.count - 1,
                };
            }, false);
        });
    };

    return (
        <section
            className="lg:overflow-y-auto lg:pr-1 lg:scrollbar lg:scrollbar-thumb-rounded lg:scrollbar-thumb-emerald-900 lg:scrollbar-track-rounded lg:scrollbar-track-zinc-900">
            <ul className={cn("grid gap-3", {
                "animate-pulse": isValidating && !isLoading
            })} ref={scrollRef}>
                <SessionProvider>
                    {!isLoading && polls.map((t) => (
                        <PollCard
                            key={t.id}
                            initialPollDetails={t}
                            loggedIn={!!userSub}
                            isUsersList={isUsersList}
                            onDeleteAction={onDelete}
                            updatedPollDetailsList={updatedPolls}
                            inViewAction={onVisibilityChange}
                        />
                    ))}

                    {!isLoading && !polls.length && (
                        <li className="text-zinc-400 text-sm">No polls found.</li>
                    )}

                    {isLoading && Array.from({length: limit}).map((_, index) => (
                        <LoadingPollCard key={index}/>
                    ))}
                </SessionProvider>
            </ul>
        </section>
    );
}
