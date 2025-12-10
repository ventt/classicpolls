"use client";

import {useEffect, useRef, useState} from "react";
import PollCard from "@/components/PollCard";
import {PollDetails} from "@/lib/model/poll-details";
import {fetchPollsDetails} from "@/app/actions";
import {SessionProvider} from "next-auth/react";
import {deletePoll} from "@/app/my-polls/my-polls";
import {OrderByOptions} from "@/app/poll-details-request-helper";
import LoadingPollCard from "@/components/LoadingPollCard";

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
    const [polls, setPolls] = useState<PollDetails[]>(initPollDetailsList);
    const [updatedPolls, setUpdatedPolls] = useState<PollDetails[]>([]);
    const [loading, setLoading] = useState<boolean | null>(null);
    const scrollRef = useRef<HTMLUListElement>(null)

    // Scroll to top when finished loading
    useEffect(() => {
        if (loading === false) {
            const hash = window.location.hash;
            if (hash) {
                const element = document.getElementById(hash.substring(1));
                if (element) {
                    element.scrollIntoView({behavior: 'smooth'});
                }

                // Remove hash from url without reloading
                history.replaceState(null, '', window.location.pathname + window.location.search);
            } else {
                scrollRef.current?.children.item(0)?.scrollIntoView();
            }
        }
    }, [loading]);

    // ----- Fetch polls when search params change -----
    useEffect(() => {
        const category = categoryName == '' ? undefined : categoryName;

        setLoading(true);
        if (onLoadingChangeAction!!) {
            onLoadingChangeAction(true);
        }

        fetchPollsDetails(
            limit,
            offset,
            OrderByOptions.get(orderBy)!!.orderBy,
            OrderByOptions.get(orderBy)!!.ascending,
            category,
            searchTerm == '' ? undefined : searchTerm,
            isUsersList ? userSub : undefined,
        ).then(response => {
            setUpdatedPolls([]);
            setPolls(response.data);
            if (onTotalChangeAction!!) {
                onTotalChangeAction(response.count);
            }

            setLoading(false);
            if (onLoadingChangeAction!!) {
                onLoadingChangeAction(false);
            }

            // Update url search params
            const url = new URL(window.location.href);
            url.searchParams.set('limit', limit.toString());
            url.searchParams.set('offset', offset.toString());
            url.searchParams.set('orderBy', orderBy);
            if (categoryName) {
                url.searchParams.set('category', categoryName);
            } else {
                url.searchParams.delete('category');
            }
            if (searchTerm) {
                url.searchParams.set('search', searchTerm);
            } else {
                url.searchParams.delete('search');
            }
            window.history.replaceState({}, '', url.toString());
        }).catch(() => {
            if (confirm('Ooops :( Sorry, there was an error on the page, do you want to reload?')) {
                window.location.reload();
            }
        });
    }, [limit, offset, orderBy, categoryName, searchTerm]);

    // ----- Auto-refresh visible polls -----
    const [visiblePollIds, setVisiblePollIds] = useState<Set<string>>(new Set());
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (visiblePollIds.size) {
                fetch('/api/poll-updates?poll_ids=' + Array.from(visiblePollIds).join(',')).then(res => {
                    if (res.ok) {
                        res.json().then(setUpdatedPolls)
                    }
                })
            }
        }, 60 * 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [visiblePollIds]);
    const onVisibilityChange = (inView: boolean, pollId: string) => {
        if (inView) {
            setVisiblePollIds(visiblePollIds.add(pollId));
        } else {
            visiblePollIds.delete(pollId);
            setVisiblePollIds(new Set(visiblePollIds));
        }
    }


    const onDelete = (pollId: string) => {
        deletePoll(pollId).then(() => setPolls(polls.filter(poll => poll.id !== pollId)))
    }

    return (
        <section
            className="lg:overflow-y-auto lg:pr-1 lg:scrollbar lg:scrollbar-thumb-rounded lg:scrollbar-thumb-emerald-900 lg:scrollbar-track-rounded lg:scrollbar-track-zinc-900">
            <ul className="grid gap-3" ref={scrollRef}>
                <SessionProvider>
                    {!loading && polls.map((t) => (
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
                    {!polls.length && (
                        <li className="text-zinc-400 text-sm">No polls found.</li>
                    )}
                    {loading && Array.from({length: 10}).map((_, index) => (
                        <LoadingPollCard key={index}/>
                    ))}
                </SessionProvider>
            </ul>
        </section>
    );
}
