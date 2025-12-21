"use client";

import {useEffect, useRef, useState} from "react";
import PollCard from "@/components/PollCard";
import {PollDetails} from "@/lib/model/poll-details";
import {SessionProvider} from "next-auth/react";
import {deletePoll} from "@/app/my-polls/my-polls";
import {OrderByOptions} from "@/app/poll-details-request-helper";
import LoadingPollCard from "@/components/LoadingPollCard";
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

    const [pollDetailsList, setPollDetailsList] = useState<PollDetails[]>(initPollDetailsList ?? []);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

    // ------- Scroll to top when finished loading -------
    useEffect(() => {
        if (!pollDetailsList) {
            return;
        }
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
    }, [pollDetailsList]);

    // ------- Update URL search params when search params / data change -------
    useEffect(() => {
        if (isFirstLoad) {
            setIsFirstLoad(false);
            return;
        } else {
            setIsLoading(true);
            onLoadingChangeAction?.(true);
        }

        // Avoid multiple fetches
        if (isLoading) {
            return;
        }

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

        fetcher(`/api/poll-details?${searchParams.toString()}`)
            .then((data: PollsResponse) => {
                setPollDetailsList(data.data);
                onTotalChangeAction?.(data.count);
            })
            .catch(() => {
                showError();
            })
            .finally(() => {
                setIsLoading(false);
                onLoadingChangeAction?.(false);
            });

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
    }, [limit, offset, orderBy, categoryName, searchTerm]);

    // ------- Error handling (similar to original catch) -------
    const showError = () => {
        if (window.confirm("Ooops :( Sorry, there was an error on the page, do you want to reload?")) {
            window.location.reload();
        }
    };


    const onDelete = (pollId: string) => {
        setIsLoading(true);
        deletePoll(pollId).then(value => {
            setIsLoading(false);

            // Remove deleted poll from list
            setPollDetailsList((current) => current.filter((poll) => poll.id !== pollId));
            onTotalChangeAction?.(pollDetailsList.length - 1);
        }).catch(() => {
            showError();
        });
    };

    return (
        <section
            className="lg:overflow-y-auto lg:pr-1 lg:scrollbar lg:scrollbar-thumb-rounded lg:scrollbar-thumb-emerald-900 lg:scrollbar-track-rounded lg:scrollbar-track-zinc-900">
            <ul className={cn("grid gap-3")} ref={scrollRef}>
                <SessionProvider>
                    {(!isLoading || isFirstLoad) && pollDetailsList.map((t) => (
                        <PollCard
                            key={t.id}
                            initialPollDetails={t}
                            loggedIn={!!userSub}
                            isUsersList={isUsersList}
                            onDeleteAction={onDelete}
                        />
                    ))}

                    {!isLoading && !pollDetailsList.length && (
                        <li className="text-zinc-400 text-sm">No polls found.</li>
                    )}

                    {isLoading && !isFirstLoad && Array.from({length: limit}).map((_, index) => (
                        <LoadingPollCard key={index}/>
                    ))}
                </SessionProvider>
            </ul>
        </section>
    );
}
