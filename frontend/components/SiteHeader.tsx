"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function SiteHeader() {
    const { data: session, status } = useSession();
    const isLoadingSession = status === "loading";

    return (
        <header className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h1 className="text-5xl font-extrabold tracking-wide">
                <Link
                    href="/"
                    aria-label="Go to homepage"
                    className="inline-block relative transition-all duration-300 ease-out
               hover:scale-[1.03] hover:drop-shadow-[0_0_12px_rgba(80,255,180,0.35)]
               focus:outline-none focus:ring-2 focus:ring-emerald-500/60 rounded-md"
                >
    <span
        className="relative text-transparent bg-clip-text bg-gradient-to-r
                 from-emerald-100 via-emerald-300 to-lime-300
                 hover:from-emerald-200 hover:via-lime-300 hover:to-emerald-400
                 drop-shadow-[0_0_4px_rgba(50,255,150,0.25)]"
        style={{
            textShadow: `0 0 3px rgba(80,255,180,0.25),
                     0 0 6px rgba(80,255,160,0.15)`,
        }}
    >
      Classic
    </span>
                    &nbsp;
                    <span
                        className="text-transparent bg-clip-text bg-gradient-to-r
                 from-lime-300 via-emerald-300 to-lime-400
                 hover:from-emerald-200 hover:via-lime-200 hover:to-lime-300
                 transition-all duration-300"
                    >
      Polls
    </span>

                    {/* Subtle underline animation */}
                    <span
                        className="absolute bottom-[-4px] left-0 w-0 h-[2px]
                 bg-gradient-to-r from-emerald-300 to-lime-400
                 rounded-full transition-all duration-300 hover:w-full"
                    />
                </Link>
            </h1>



            {isLoadingSession ? (
                <div className="text-zinc-400">Loading...</div>
            ) : session ? (
                <div className="flex items-center gap-3">
                    {session.user?.image ? (
                        <img src={session.user.image} alt="avatar" className="w-8 h-8 rounded-full" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-zinc-700" />
                    )}
                    <span className="font-medium">{session.user?.name}</span>
                    <Link href="/new-topic" className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition">
                        New Topic
                    </Link>
                    <Link
                        href="/my-topics"
                        className="px-3 py-1 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition"
                    >
                        My Topics
                    </Link>
                    <button
                        className="px-3 py-1 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition"
                        onClick={() => signOut()}
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <button
                    className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition"
                    onClick={() => signIn("discord")}
                >
                    Sign in with Discord
                </button>
            )}
        </header>
    );
}
