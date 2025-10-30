"use client";
import Link from "next/link";
import ShareButton from "@/components/ShareButton";
import {PollDetails} from "@/lib/model/poll-details";
import {useMemo, useState} from "react";
import {cn} from "@/lib/utils";
import {addPollVote} from "@/app/actions";

export default function PollCard({initialPollDetails, loggedIn, isUsersList, onDeleteAction}: {
    initialPollDetails: PollDetails;
    loggedIn: boolean;
    isUsersList: boolean;
    onDeleteAction: (pollId: string) => void;
}) {
    const [pollDetails, setPollDetails] = useState<PollDetails>(initialPollDetails);
    const [voteInProgress, setVoteInProgress] = useState<boolean>(false);

    const ratio = useMemo(
        () => (pollDetails.upvotes / pollDetails.total_votes), [pollDetails]
    );
    const votePercentage = useMemo(
        () => (pollDetails.total_votes ? Math.round((pollDetails.upvotes / pollDetails.total_votes) * 100) : 0),
        [pollDetails]
    );


    const vote = function (choice: boolean) {
        setVoteInProgress(true);
        addPollVote(pollDetails.id, choice).then(r => {
            let modified = {} as PollDetails;
            Object.assign(modified, pollDetails);

            modified.user_choice = choice;

            // If user has already voted
            if (pollDetails.user_choice != null) {
                if (choice) {
                    modified.upvotes++;
                    modified.downvotes--;
                } else {
                    modified.upvotes--;
                    modified.downvotes++;
                }
            } else {
                // If user haven't voted
                if (choice) {
                    modified.upvotes++;
                } else {
                    modified.downvotes++;
                }
                modified.total_votes++;
            }

            setPollDetails(modified);
            setVoteInProgress(false);
        });
    }

    let borderClass
    let cardBg

    if (ratio < 0.4) {
        borderClass = "border-red-600/70";
        cardBg = "bg-zinc-900/80";
    } else if (ratio < 0.7) {
        borderClass = "border-yellow-600/70";
        cardBg = "bg-zinc-900/70";
    } else {
        borderClass = "border-green-600/70";
        cardBg = "bg-emerald-900/20";
    }

    const shareUrl = typeof window !== "undefined"
        ? `${window.location.origin}/poll/${pollDetails.id}`
        : `/poll/${pollDetails.id}`;

    return (
        <li className={`border ${borderClass} rounded-xl p-4 ${cardBg} shadow-sm transition`}>
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <Link href={`/poll/${pollDetails.id}`} className="block hover:underline decoration-emerald-400/60">
                        <h3 className="font-semibold text-lg text-white truncate">{pollDetails.title} </h3>
                    </Link>
                    <p className="text-sm text-zinc-400">{pollDetails.category_name}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <ShareButton url={shareUrl} title={pollDetails.title}/>
                    {loggedIn && !isUsersList && (
                        <>
                            <button
                                aria-label="Upvote"
                                className="p-2 rounded-lg border border-emerald-700/60 bg-emerald-900/30 enabled:hover:bg-emerald-800/50 enabled:active:scale-95 transition enabled:cursor-pointer disabled:bg-emerald-400 disabled:border-emerald-300"
                                onClick={() => vote(true)}
                                title="Upvote"
                                disabled={pollDetails.user_choice === true || voteInProgress}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                     className={cn("text-emerald-400 transition-all", {
                                         "text-white": pollDetails.user_choice === true
                                     })}>
                                    <path d="M12 4l-7 8h4v8h6v-8h4l-7-8z" fill="currentColor"/>
                                </svg>
                            </button>
                            <button
                                aria-label="Downvote"
                                className="p-2 rounded-lg border border-red-700/60 bg-red-900/30 enabled:hover:bg-red-800/50 enabled:active:scale-95 transition-all enabled:cursor-pointer disabled:bg-red-500"
                                onClick={() => vote(false)}
                                title="Downvote"
                                disabled={pollDetails.user_choice === false || voteInProgress}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                     className={cn("text-red-400 transition-all", {
                                         "text-white": pollDetails.user_choice === false
                                     })}>
                                    <path d="M12 20l7-8h-4V4H9v8H5l7 8z" fill="currentColor"/>
                                </svg>
                            </button>
                        </>
                    )}
                    {isUsersList && (
                        <button
                            aria-label="Downvote"
                            className="p-2 rounded-lg border border-red-700/60 bg-red-900/30 hover:bg-red-800/50 active:scale-95 transition-all cursor-pointer "
                            onClick={() => onDeleteAction(pollDetails.id)}
                            title="Delete"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>

            {pollDetails.description ? (
                <div className="relative mt-2">
                    <p className="text-sm text-zinc-300 leading-6 max-h-24 overflow-hidden fade-bottom">
                        {pollDetails.description}
                    </p>
                </div>
            ) : null
            }

            <div className="mt-3">
                <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all ease-out duration-500"
                         style={{width: `${votePercentage}%`}}/>
                </div>
                <div className="mt-1 text-xs text-zinc-400 flex items-center gap-3">
                    <div className="opacity-70"><span
                        className="font-medium text-zinc-200">{votePercentage}%</span> positive
                        • <span className="text-emerald-400">{pollDetails.upvotes} up</span> / <span
                            className="text-red-400">{pollDetails.downvotes} down</span> • {pollDetails.total_votes} votes
                    </div>
                </div>
            </div>
        </li>
    );
}
