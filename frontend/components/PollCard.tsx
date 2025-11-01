"use client";
import Link from "next/link";
import ShareButton from "@/components/ShareButton";
import {PollDetails} from "@/lib/model/poll-details";
import {useEffect, useMemo, useState} from "react";
import {cn} from "@/lib/utils";
import {addPollVote} from "@/app/actions";
import {signIn} from "next-auth/react";
import {useOnInView} from "react-intersection-observer";

export default function PollCard({
                                     initialPollDetails,
                                     loggedIn,
                                     isUsersList,
                                     onDeleteAction,
                                     updatedPollDetailsList,
                                     inViewAction
                                 }: {
    initialPollDetails: PollDetails;
    loggedIn: boolean;
    isUsersList: boolean;
    onDeleteAction: (pollId: string) => void;
    updatedPollDetailsList?: PollDetails[]; // Used to refresh poll details periodically
    inViewAction?: (inView: boolean, pollId: string) => void;
}) {
    const [pollDetails, setPollDetails] = useState<PollDetails>(initialPollDetails);
    const [voteInProgress, setVoteInProgress] = useState<boolean>(false);

    const [showConfirm, setShowConfirm] = useState(false);

    const ratio = useMemo(() => (pollDetails.upvotes / pollDetails.total_votes), [pollDetails]);
    const votePercentage = useMemo(
        () => (pollDetails.total_votes ? Math.round((pollDetails.upvotes / pollDetails.total_votes) * 100) : 0),
        [pollDetails]
    );

    // Refresh poll details when updatedPollDetailsList changes
    if (updatedPollDetailsList) {
        useEffect(() => {
            const newPollDetails = updatedPollDetailsList.filter(pd => pd.id == pollDetails.id).pop();
            if (newPollDetails) {
                // Merge new details into current pollDetails
                setPollDetails({...pollDetails, ...newPollDetails});
            }
        }, [updatedPollDetailsList]);
    }

    const handleInViewChange = (inView: boolean) => {
        if (!!inViewAction) {
            inViewAction(inView, pollDetails.id);
        }
    }

    // Call inViewAction when visibility changes
    const inViewRef = useOnInView(handleInViewChange);

    const vote = function (choice: boolean) {
        setVoteInProgress(true);
        addPollVote(pollDetails.id, choice).then(() => {
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
    let hoverColor

    if (ratio < 0.4) {
        borderClass = "border-red-600/70";
        cardBg = "bg-zinc-900/80";
        hoverColor = "hover:text-red-600/70";
    } else if (ratio < 0.7) {
        borderClass = "border-yellow-600/70";
        cardBg = "bg-zinc-900/70";
        hoverColor = "hover:text-yellow-600/70"
    } else {
        borderClass = "border-green-600/70";
        cardBg = "bg-emerald-900/20";
        hoverColor = "hover:text-green-600/70"
    }

    const shareUrl = typeof window !== "undefined"
        ? `${window.location.origin}/poll/${pollDetails.id}`
        : `/poll/${pollDetails.id}`;

    return (
        <li className={`border ${borderClass} rounded-xl p-4 ${cardBg} shadow-sm transition`} ref={inViewRef}>
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <Link href={`/poll/${pollDetails.id}`} className="block">
                        <h3 className={`font-semibold text-lg text-white truncate ${hoverColor}`}>
                            {pollDetails.title}
                        </h3>
                    </Link>

                    <div className="flex items-center gap-2">
                        <p className="text-shadow-md text-zinc-400">{pollDetails.category_name}</p>

                        {pollDetails.description && (
                            <Link
                                href={`/poll/${pollDetails.id}`}
                                className="inline-block px-1 py-0.5 text-[10px] text-sm text-purple-400 border border-purple-800 rounded-md hover:bg-purple-800 hover:text-white transition-colors duration-200"
                            >
                                With Description
                            </Link>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <ShareButton url={shareUrl} title={pollDetails.title}/>
                    {loggedIn && !isUsersList ? (
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
                    ) : !isUsersList && (
                        <button onClick={() => signIn("discord")}
                                className="text-xs px-2 py-1 rounded-md border border-zinc-700 hover:bg-zinc-800 text-zinc-200 transition cursor-pointer">
                            Sign in to vote
                        </button>)
                    }
                    {isUsersList && (
                        <button
                            aria-label="Delete Poll"
                            className="p-0.5 rounded-lg border border-red-700/60 bg-red-900/30 hover:bg-red-800/50 active:scale-95 text-white transition-all cursor-pointer "
                            onClick={() => setShowConfirm(true)}
                            title="Delete"
                        >

                            Delete
                        </button>
                    )}
                    {showConfirm && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                            <div className="bg-gray-900 text-white p-6 rounded-lg shadow-xl w-80">
                                <h2 className="text-lg font-semibold mb-2">Confirm Delete</h2>
                                <p className="text-sm mb-1">
                                    Are you sure you want to permanently delete this?
                                </p>
                                <p className="text-sm font-bold text-red-500 mb-5">
                                    This action cannot be undone.
                                </p>

                                <div className="flex justify-end gap-3">
                                    <button
                                        className="px-3 py-1 rounded-md bg-gray-600 hover:bg-gray-500 transition"
                                        onClick={() => setShowConfirm(false)}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className="px-3 py-1 rounded-md bg-red-700 hover:bg-red-600 transition cursor-pointer"
                                        onClick={() => {
                                            onDeleteAction(pollDetails.id);
                                            setShowConfirm(false);
                                        }}
                                    >
                                        Yes, Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

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
