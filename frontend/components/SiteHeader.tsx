import Link from "next/link";
import {getServerAuth} from "@/lib/auth";
import {SignInButton, SignOutButton} from "@/components/AuthClientButtons";

export default async function SiteHeader() {
    const session = await getServerAuth();

    return (
        <header className="flex items-center justify-between border-b border-zinc-800 pb-3 text-white">
            <h1 className="text-5xl font-extrabold tracking-wide">
                <Link
                    href="/"
                    aria-label="Go to homepage"
                    className="inline-block relative transition-all duration-300 ease-out
                               hover:scale-[1.03] hover:drop-shadow-[0_0_12px_rgba(80,255,180,0.35)]
                               focus:outline-none rounded-md">
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r
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
                    <span className="text-transparent bg-clip-text bg-gradient-to-r
                    from-lime-300 via-emerald-300 to-lime-400
                    hover:from-emerald-200 hover:via-lime-200 hover:to-lime-300
                    transition-all duration-300"
                    >
                    Polls
                </span>
                </Link>
            </h1>

            {session ? (
                <div className="flex items-center gap-3">
                    {session.user?.image ? (
                        <img src={session.user.image} alt="avatar" className="w-8 h-8 rounded-full"/>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-zinc-700"/>
                    )}
                    <span className="font-medium">{session.user?.name}</span>
                    <Link href="/new-poll"
                          className="px-3 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-600 transition">
                        New Poll
                    </Link>
                    <Link
                        href="/my-polls"
                        className="px-3 py-1 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition"
                    >
                        My Polls
                    </Link>
                    <SignOutButton />
                </div>
            ) : (
                <SignInButton />
            )}
        </header>
    );
}
