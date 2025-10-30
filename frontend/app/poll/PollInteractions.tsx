"use client";

import {useMemo, useState} from "react";
import {signIn} from "next-auth/react";
import {PollDetails} from "@/lib/model/poll-details";
import {VoteDetails} from "@/app/poll/vote-details";
import {Session} from "next-auth";
import {cn} from "@/lib/utils";
import {addPollVote} from "@/app/actions";

export default function PollInteractions({initialPollDetails, votes, session}: {
    initialPollDetails: PollDetails,
    votes: VoteDetails[],
    session: Session | null
}) {
    const loggedIn = session && session.user;
    const [recentVotes, setRecentVotes] = useState<VoteDetails[]>(votes);

    const [pollDetails, setPollDetails] = useState<PollDetails>(initialPollDetails);
    const [voteInProgress, setVoteInProgress] = useState<boolean>(false);

    const votePercentage = useMemo(
        () => (pollDetails.total_votes ? Math.round((pollDetails.upvotes / pollDetails.total_votes) * 100) : 0),
        [pollDetails]
    );

    const vote = function (choice: boolean) {
        setVoteInProgress(true);
        addPollVote(pollDetails.id, choice).then(r => {
            let modified = {} as PollDetails;
            Object.assign(modified, pollDetails);
            // TODO
            // let modifiedRecentVotes = {} as VoteDetails[];
            // Object.assign(modifiedRecentVotes, recentVotes);
            // let userVote = recentVotes.filter(v => )
            // get user name from sub and remove from the list if exists and add to the recent votes,
            // if recentVotes length exceeds 6 remove the last one

            modified.user_choice = choice;

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

    return (
        <div className="mt-5 space-y-5">
            <div>
                <div className="flex items-center justify-between gap-3">
                    <div className="text-sm text-zinc-400">
                        <span className="font-medium text-zinc-200">{votePercentage}%</span> positive
                        • {pollDetails.upvotes} up / {pollDetails.downvotes} down • {pollDetails.total_votes} votes
                    </div>

                    {loggedIn ? (
                        <div className="flex items-center gap-2">
                            <button
                                aria-label="Upvote"
                                disabled={pollDetails.user_choice === true || voteInProgress}
                                onClick={() => vote(true)}
                                className="p-2 rounded-lg border border-emerald-700/60 bg-emerald-900/30 enabled:hover:bg-emerald-800/50 enabled:active:scale-95 transition enabled:cursor-pointer disabled:bg-emerald-400 disabled:border-emerald-300"
                                title="Upvote"
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
                                disabled={pollDetails.user_choice === false || voteInProgress}
                                onClick={() => vote(false)}
                                className="p-2 rounded-lg border border-red-700/60 bg-red-900/30 enabled:hover:bg-red-800/50 enabled:active:scale-95 transition enabled:cursor-pointer disabled:bg-red-500"
                                title="Downvote"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                     className={cn("text-red-400 transition-all", {
                                         "text-white": pollDetails.user_choice === false
                                     })}>
                                    <path d="M12 20l7-8h-4V4H9v8H5l7 8z" fill="currentColor"/>
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => signIn("discord")}
                            className="text-xs px-2 py-1 rounded-md border border-zinc-700 hover:bg-zinc-800 text-zinc-200 transition"
                        >
                            Sign in to vote
                        </button>
                    )}
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-zinc-800 overflow-hidden ">
                    <div className="h-full bg-emerald-500 transition-all" style={{width: `${votePercentage}%`}}/>
                </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40">
                <div className="px-4 py-3 border-b border-zinc-800 text-sm text-zinc-300">Recent votes</div>

                {recentVotes && recentVotes.length ? (
                    <ul className="divide-y divide-zinc-800">
                        {recentVotes.map((vote, idx) => {
                            const faded = idx === 5;
                            return (
                                <li
                                    key={idx}
                                    className={`px-4 py-3 flex items-center gap-3 transition ${faded ? "opacity-50 grayscale-[30%]" : ""}`}
                                >
                                    {vote.user?.image ? (
                                        <img src={vote.user.image} alt="" className="w-7 h-7 rounded-full"/>
                                    ) : (
                                        <div className="w-7 h-7 rounded-full bg-zinc-700"/>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm text-zinc-200 truncate">
                                            <span className="font-medium">{vote.user?.name ?? "Anon"}</span>{" "}
                                            {vote.choice ? <span className="text-emerald-400">upvoted</span> :
                                                <span className="text-red-400">downvoted</span>}
                                        </div>
                                        <div
                                            className="text-xs text-zinc-500">{new Date(vote.created_at).toLocaleString()}</div>
                                    </div>
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-md border ${
                                            vote.choice
                                                ? "text-emerald-300 border-emerald-700/50 bg-emerald-900/30"
                                                : "text-red-300 border-red-700/50 bg-red-900/30"
                                        }`}
                                    >
                                    {vote.choice ? "Up" : "Down"}
                                  </span>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="p-4 text-sm text-zinc-400">No votes yet.</div>
                )}
            </div>
        </div>
    );
}
