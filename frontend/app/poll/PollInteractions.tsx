"use client";

import {useMemo, useState} from "react";
import {signIn, useSession} from "next-auth/react";
import {PollDetails} from "@/lib/model/poll-details";
import {VoteDetails} from "@/app/poll/vote-details";
import {Session} from "next-auth";

export default function PollInteractions({poll_details, votes, session}: { poll_details: PollDetails, votes: VoteDetails[], session: Session | null }) {
    const loggedIn = session && session.user;

    const [detailsState, setDetailsState] = useState<PollDetails>(poll_details);
    const [votesState, setVotesState] = useState<VoteDetails[]>(votes);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState<null | 1 | -1>(null);

    const votePercentage = useMemo(
        () => (detailsState.total_votes ? Math.round((detailsState.upvotes / detailsState.total_votes) * 100) : 0),
        [detailsState]
    );

    return (
        <div className="mt-5 space-y-5">
            {/* progress + action */}
            <div>
                <div className="flex items-center justify-between gap-3">
                    <div className="text-sm text-zinc-400">
                        <span className="font-medium text-zinc-200">{votePercentage}%</span> positive
                        • {detailsState.upvotes} up / {detailsState.downvotes} down • {detailsState.total_votes} votes
                    </div>

                    {loggedIn ? (
                        <div className="flex items-center gap-2">
                            <button
                                aria-label="Upvote"
                                disabled={sending !== null}
                                onClick={() => prompt("upvote")}
                                className="p-2 rounded-lg border border-emerald-700/60 bg-emerald-900/30 hover:bg-emerald-800/50 active:scale-95 transition disabled:opacity-50"
                                title="Upvote"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                     className="text-emerald-400">
                                    <path d="M12 4l-7 8h4v8h6v-8h4l-7-8z" fill="currentColor"/>
                                </svg>
                            </button>
                            <button
                                aria-label="Downvote"
                                disabled={sending !== null}
                                onClick={() => prompt("downvote")}
                                className="p-2 rounded-lg border border-red-700/60 bg-red-900/30 hover:bg-red-800/50 active:scale-95 transition disabled:opacity-50"
                                title="Downvote"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-red-400">
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
                <div className="mt-2 h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{width: `${votePercentage}%`}}/>
                </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40">
                <div className="px-4 py-3 border-b border-zinc-800 text-sm text-zinc-300">Recent votes</div>

                {votesState && votesState.length ? (
                    <ul className="divide-y divide-zinc-800">
                        {votesState.map((v, idx) => {
                            const faded = idx === 5;
                            return (
                                <li
                                    key={idx}
                                    className={`px-4 py-3 flex items-center gap-3 transition ${faded ? "opacity-50 grayscale-[30%]" : ""}`}
                                >
                                    {v.user?.image ? (
                                        <img src={v.user.image} alt="" className="w-7 h-7 rounded-full"/>
                                    ) : (
                                        <div className="w-7 h-7 rounded-full bg-zinc-700"/>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm text-zinc-200 truncate">
                                            <span className="font-medium">{v.user?.name ?? "Anon"}</span>{" "}
                                            {v.choice ? <span className="text-emerald-400">upvoted</span> :
                                                <span className="text-red-400">downvoted</span>}
                                        </div>
                                        <div
                                            className="text-xs text-zinc-500">{new Date(v.created_at).toLocaleString()}</div>
                                    </div>
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-md border ${
                                            v.choice
                                                ? "text-emerald-300 border-emerald-700/50 bg-emerald-900/30"
                                                : "text-red-300 border-red-700/50 bg-red-900/30"
                                        }`}
                                    >
                                    {v.choice ? "Up" : "Down"}
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
