"use client";
import Link from "next/link";
import ShareButton from "@/components/ShareButton";
import {PollDetails} from "@/lib/model/poll-details";
import {useEffect, useMemo, useState} from "react";
import {cn} from "@/lib/utils";
import {addPollVote} from "@/app/actions";
import {signIn} from "next-auth/react";
import {useOnInView} from "react-intersection-observer";
import ConfirmDialog from "@/components/ConfirmDialog";
import {useRouter} from "next/navigation";

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
    const router = useRouter()
    const [pollDetails, setPollDetails] = useState<PollDetails>(initialPollDetails);

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

        // Optimistically update the poll details
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

        addPollVote(pollDetails.id, choice).catch(() => {
            if (confirm('Ooops :( Sorry, there was an error on the page, do you want to reload?')) {
                window.location.reload();
            }
        });
    }

    const onHover = (pollId: string) => {
        router.prefetch(`/poll/${pollId}`);
    }
    const onClick = (pollId: string) => {
        const url = new URL(window.location.href);
        url.hash = pollId
        window.history.replaceState({}, '', url.toString());
    }

    const resetAnchor = () => {
        // Remove hash from url without reloading
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    const shareUrl = typeof window !== "undefined"
        ? `${window.location.origin}/poll/${pollDetails.id}`
        : `/poll/${pollDetails.id}`;

    return (
        <li className={cn("flex flex-col min-w-0 border rounded-xl p-4 ${cardBg} shadow-sm transition border-gray-600/70 bg-gray-900/20 ",
            {
                "border-red-600/70": ratio < 0.4,
                "border-yellow-600/70": ratio >= 0.4 && ratio < 0.7,
                "border-green-600/70": ratio >= 0.7,
                "bg-zinc-900/80": ratio < 0.4,
                "bg-zinc-900/70": ratio >= 0.4 && ratio < 0.7,
                "bg-emerald-900/20": ratio >= 0.7,
                "hover:text-red-600/70": ratio < 0.4,
                "hover:text-yellow-600/70": ratio >= 0.4 && ratio < 0.7,
                "hover:text-green-600/70": ratio >= 0.7,
            })}
            ref={inViewRef}>
            <div className="flex items-start justify-between gap-3"
                 id={pollDetails.id}
                 onMouseEnter={() => onHover(pollDetails.id)}
                 onMouseLeave={resetAnchor}
            >
                <div className="min-w-0">
                    <Link href={`/poll/${pollDetails.id}`} className="block" prefetch={false}
                          onClick={() => onClick(pollDetails.id)}>
                        <h3 className={cn("font-semibold text-lg text-white truncate hover:text-gray-600", {
                            "hover:text-red-600/70": ratio < 0.4,
                            "hover:text-yellow-600/70": ratio >= 0.4 && ratio < 0.7,
                            "hover:text-green-600/70": ratio >= 0.7,
                        })}>
                            {pollDetails.title}
                        </h3>
                    </Link>

                    <div className="flex items-center gap-2">
                        <p className="text-shadow-md text-zinc-400">{pollDetails.category_name}</p>

                        {pollDetails.description && (
                            <Link prefetch={false}
                                  onClick={() => onClick(pollDetails.id)}
                                  href={`/poll/${pollDetails.id}`}
                                  className="inline-block px-1 py-0.5 text-[10px] text-sm text-purple-400 border border-purple-800 rounded-md hover:bg-purple-800 hover:text-white transition-colors duration-200"
                            >
                                with description
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
                                className={cn("p-2 rounded-lg border border-emerald-700/60 bg-emerald-900/30 enabled:hover:bg-emerald-800/50 enabled:active:scale-95 transition enabled:cursor-pointer",
                                    {
                                        "bg-emerald-400 border-emerald-300": pollDetails.user_choice === true,
                                    })}
                                onClick={() => vote(true)}
                                title="Upvote"
                                disabled={pollDetails.user_choice === true}
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
                                className={cn("p-2 rounded-lg border border-red-700/60 bg-red-900/30 enabled:hover:bg-red-800/50 enabled:active:scale-95 transition-all enabled:cursor-pointer", {
                                    "bg-red-500": pollDetails.user_choice === false,
                                })}
                                onClick={() => vote(false)}
                                title="Downvote"
                                disabled={pollDetails.user_choice === false}
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
                            className="relative inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-xs border-red-700/60 bg-red-900/30 hover:bg-red-800/50 active:scale-95 text-white transition-all cursor-pointer "
                            onClick={() => setShowConfirm(true)}
                            title="Delete"
                        >

                            Delete
                        </button>
                    )}
                    {showConfirm && (
                        <ConfirmDialog
                            open={showConfirm}
                            onCancel={() => setShowConfirm(false)}
                            onConfirm={() => {
                                onDeleteAction(pollDetails.id);
                                setShowConfirm(false);
                            }}
                        />
                    )}


                </div>
            </div>

            <div className="flex flex-col mt-3">
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
