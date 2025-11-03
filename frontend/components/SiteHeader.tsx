import Link from "next/link";
import {getServerAuth} from "@/lib/auth";
import {SignInButton, SignOutButton} from "@/components/AuthClientButtons";
import CloseDetailsOnRouteChange from "@/components/CloseDetailsOnRouteChange";

export default async function SiteHeader() {
    const session = await getServerAuth();

    return (
        <header className="flex items-center pb-2 pt-2 justify-between border-b border-zinc-800 text-white">
            {/* Logo */}
            <h1 className="xl:text-5xl text-4xl font-extrabold tracking-wide">
                <a
                    href="/"
                    aria-label="Go to homepage"
                    className="inline-block relative transition-all duration-300 ease-out
                     hover:drop-shadow-[0_0_6px_rgba(80,255,180,0.35)]
                     focus:outline-none rounded-md"
                >
          <span
              className="relative text-transparent bg-clip-text bg-gradient-to-r
                       from-emerald-100 via-emerald-300 to-lime-300"
              style={{
                  textShadow: `0 0 3px rgba(80,255,180,0.25),
                     0 0 6px rgba(80,255,160,0.15)`,
              }}
          >
            Classic Polls
          </span>
                </a>
            </h1>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-3">
                {session ? (
                    <>
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
                        <Link href="/my-polls"
                              className="px-3 py-1 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition">
                            My Polls
                        </Link>
                        <SignOutButton/>
                    </>
                ) : (
                    <div className="flex items-center gap-2 pb-2">
                        <span className="text-sm text-emerald-600">only asks for username -&gt;</span>
                    <SignInButton/>
                    </div>
                )}
            </nav>

            {/* Mobile Hamburger (no JS) */}
            <details className="md:hidden relative group">
                <summary
                    aria-label="Toggle menu"
                    className="list-none [&::-webkit-details-marker]:hidden cursor-pointer p-2 rounded-md hover:bg-zinc-800 transition flex items-center"
                >
                    {/* Hamburger icon that morphs to X when open */}
                    <div className="flex flex-col gap-1.5">
                        <span
                            className="h-0.5 w-6 bg-white transition group-open:rotate-45 group-open:translate-y-[7px]"/>
                        <span className="h-0.5 w-6 bg-white transition group-open:opacity-0"/>
                        <span
                            className="h-0.5 w-6 bg-white transition group-open:-rotate-45 group-open:-translate-y-[7px]"/>
                    </div>
                </summary>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-44 bg-zinc-900 border border-zinc-700 rounded-lg p-3 flex flex-col gap-2 z-50
                        origin-top-right transition-transform duration-150 ease-out
                        group-open:scale-100 scale-95">
                    {session ? (
                        <>
                            <div className="flex items-center gap-2 border-b border-zinc-700 pb-2">
                                {session.user?.image ? (
                                    <img src={session.user.image} alt="avatar" className="w-8 h-8 rounded-full"/>
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-zinc-700"/>
                                )}
                                <span className="text-sm">{session.user?.name}</span>
                            </div>
                            <Link href="/new-poll" className="hover:text-emerald-300 transition">New Poll</Link>
                            <Link href="/my-polls" className="hover:text-emerald-300 transition">My Polls</Link>
                            <SignOutButton/>
                        </>
                    ) : (
                        <SignInButton/>
                    )}
                </div>
            </details>
            <CloseDetailsOnRouteChange/>
        </header>
    );
}
