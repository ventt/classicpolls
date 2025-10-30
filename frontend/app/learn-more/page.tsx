'use server'
import SiteHeader from "@/components/SiteHeader";
import AdLayout from "@/app/ad-layout";
import {SignInButton} from "@/components/AuthClientButtons";
import {getServerAuth} from "@/lib/auth";


export default async function Page() {
    const session = await getServerAuth();
    return (
        <AdLayout>
            <main className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                <SiteHeader/>
                <div className="max-h-[90vh] overflow-y-auto pr-1 fancy-scrollbar space-y-6">
                    {/* Intro */}
                    <section className="rounded-xl border border-emerald-600/20 bg-zinc-900/40 p-6">
                        <h1 className="text-2xl font-semibold text-emerald-200 tracking-tight">Learn more</h1>
                        <p className="mt-3 text-zinc-200 leading-relaxed">
                            This site was built by and for the <span className="text-emerald-300 font-medium">World of Warcraft Classic+</span> community.
                            It exists to give players a clear, quantifiable way to express what they want from Classic+
                            and to show Blizzard how the community’s
                            preferences evolve over time. Anyone can browse polls. Signing in with Discord lets you vote
                            and create new polls about the Classic+ vision.
                        </p>
                    </section>

                    {/* How it works */}
                    <section className="grid gap-6 lg:grid-cols-3">
                        <div className="rounded-xl border border-emerald-600/20 bg-zinc-900/40 p-6 flex flex-col">
                            <h2 className="text-xl font-semibold text-emerald-200">1) Browse community polls</h2>
                            <p className="mt-2 text-zinc-300">
                                Explore ideas from players across realms and regions. Examples include:
                            </p>
                            <ul className="mt-3 space-y-2 text-zinc-200 list-disc pl-5">
                                <li>Should there be dual talent specs in Classic+?</li>
                                <li>Should new endgame systems be introduced?</li>
                                <li>Should Classic+ avoid major class reworks?</li>
                                <li>Should raids rotate seasonal affixes?</li>
                            </ul>

                            <div className="mt-auto pt-6">
                                <a
                                    href="/polls"
                                    className="w-full inline-flex justify-center items-center rounded-lg border border-emerald-500/40 bg-emerald-600/10 px-4 py-2 h-10 text-sm font-medium text-emerald-200 hover:bg-emerald-600/20"
                                >
                                    Browse polls
                                </a>
                            </div>
                        </div>

                        <div className="rounded-xl border border-emerald-600/20 bg-zinc-900/40 p-6 flex flex-col">
                            <h2 className="text-xl font-semibold text-emerald-200">2) Sign in with Discord</h2>
                            <p className="mt-2 text-zinc-300">
                                Voting and poll creation require a quick Discord sign-in.
                            </p>
                            <ul className="mt-3 space-y-2 text-zinc-200 list-disc pl-5">
                                <li>
                                    We only request your Discord <span
                                    className="font-medium">display name</span> and{" "}
                                    <span className="font-medium">avatar</span>.
                                </li>
                                <li>No DMs, friends list, or server access is requested.</li>
                            </ul>
                            {session ? (
                                <div className="mt-auto pt-6">
                                    <a
                                        className="w-full inline-flex justify-center items-center rounded-lg border border-emerald-500/40 px-4 py-2 h-10 text-sm font-medium text-emerald-200 bg-emerald-600/20"
                                    >
                                        You’re signed in.
                                    </a>
                                </div>
                            ) : (
                                <div className="mt-auto pt-6">
                                    <SignInButton
                                        design='w-full inline-flex justify-center items-center rounded-lg px-4 py-2 h-10 text-sm font-medium text-white font-bold'/>
                                </div>
                            )}

                        </div>

                        <div className="rounded-xl border border-emerald-600/20 bg-zinc-900/40 p-6 flex flex-col">
                            <h2 className="text-xl font-semibold text-emerald-200">3) Vote and create polls</h2>
                            <p className="mt-2 text-zinc-300">
                                Cast your vote on any poll and share it with friends and guildmates. Have a fresh idea?
                                Turn it
                                into a poll in minutes.
                            </p>
                            <ol className="mt-3 space-y-2 text-zinc-200 list-decimal pl-5">
                                <li>Click <span className="font-medium">New Poll</span>.</li>
                                <li>Write a clear question and brief context.</li>
                                <li>Keep your question limited to a yes or no answer.</li>
                                <li>Publish, share, and iterate based on feedback.</li>
                            </ol>

                            <div className="mt-auto pt-6">
                                <a
                                    href="/new-poll"
                                    className="w-full inline-flex justify-center items-center rounded-lg border border-emerald-500/40 bg-emerald-600/10 px-4 py-2 h-10 text-sm font-medium text-emerald-200 hover:bg-emerald-600/20"
                                >
                                    Create a new poll
                                </a>
                            </div>
                        </div>
                    </section>


                    {/* Why it matters */}
                    <section className="rounded-xl border border-emerald-600/20 bg-zinc-900/40 p-6">
                        <h2 className="text-xl font-semibold text-emerald-200">Why this matters</h2>
                        <p className="mt-2 text-zinc-200">
                            Classic+ discussions are everywhere, but they’re scattered and hard to quantify. This
                            platform aggregates sentiment into visible,
                            shareable data. Our goal is to reach every Classic+ enjoyer so the community’s voice is hard
                            to miss.
                        </p>
                        <p className="text-zinc-200 font-bold">
                            As the dataset grows, it
                            becomes a valuable signal for Blizzard to understand what players actually want.
                        </p>
                    </section>

                    {/* Quick start */}
                    <section className="rounded-xl border border-emerald-600/20 bg-zinc-900/40 p-6">
                        <h2 className="text-xl font-semibold text-emerald-200">Quick start</h2>
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <div className="rounded-lg border border-zinc-700/60 p-4">
                                <h3 className="font-semibold text-emerald-100">For voters</h3>
                                <ul className="mt-2 list-disc pl-5 space-y-2 text-zinc-200">
                                    <li>Sign in with Discord and verify your display name.</li>
                                    <li>Open any poll and choose your answer.</li>
                                    <li>Share the poll link in guild chat or social channels.</li>
                                    <li>Revisit results to watch trends over time.</li>
                                </ul>
                            </div>
                            <div className="rounded-lg border border-zinc-700/60 p-4">
                                <h3 className="font-semibold text-emerald-100">For creators</h3>
                                <ul className="mt-2 list-disc pl-5 space-y-2 text-zinc-200">
                                    <li>Write a focused, single-topic question.</li>
                                    <li>Add a short context paragraph so voters understand intent.</li>
                                    <li>Prefer unambiguous answers (Yes/No).</li>
                                    <li>Tag your poll so players can find it later.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Data and privacy */}
                    <section className="rounded-xl border border-emerald-600/20 bg-zinc-900/40 p-6">
                        <h2 className="text-xl font-semibold text-emerald-200">Data, privacy, and transparency</h2>
                        <ul className="mt-3 space-y-2 text-zinc-200 list-disc pl-5">
                            <li>Sign-in requests your Discord display name and avatar only.</li>
                            <li>No messages, servers, or friends list access.</li>
                        </ul>
                    </section>

                    {/* Roadmap */}
                    <section className="rounded-xl border border-emerald-600/20 bg-zinc-900/40 p-6">
                        <h2 className="text-xl font-semibold text-emerald-200">Roadmap</h2>
                        <p className="mt-2 text-zinc-300">Where we are headed next:</p>
                        <ul className="mt-3 grid gap-3 md:grid-cols-2 text-zinc-200">
                            <li className="rounded-lg border border-zinc-700/60 p-4">
                                <p className="font-medium text-emerald-100">Phase 1: Community growth</p>
                                <p className="text-sm text-zinc-300 mt-1">Outreach, better sharing, and featured
                                    polls.</p>
                            </li>
                            <li className="rounded-lg border border-zinc-700/60 p-4">
                                <p className="font-medium text-emerald-100">Phase 2: Deeper insights</p>
                                <p className="text-sm text-zinc-300 mt-1">Trend charts, vote breakdowns, and anti-spam
                                    protections.</p>
                            </li>
                            <li className="rounded-lg border border-zinc-700/60 p-4">
                                <p className="font-medium text-emerald-100">Phase 3: If Classic+ becomes official</p>
                                <p className="text-sm text-zinc-300 mt-1">Pivot to patch planning polls and feature
                                    prioritization.</p>
                            </li>
                            <li className="rounded-lg border border-zinc-700/60 p-4">
                                <p className="font-medium text-emerald-100">Phase 4: Developer-facing reports</p>
                                <p className="text-sm text-zinc-300 mt-1">Exportable summaries.</p>
                            </li>
                        </ul>
                    </section>

                    {/* Community guidelines */}
                    <section className="rounded-xl border border-emerald-600/20 bg-zinc-900/40 p-6">
                        <h2 className="text-xl font-semibold text-emerald-200">Community guidelines</h2>
                        <ul className="mt-3 list-disc pl-5 space-y-2 text-zinc-200">
                            <li>Focus on the game and ideas. No harassment or personal attacks.</li>
                            <li>One topic per poll. Avoid duplicates and low-effort spam.</li>
                            <li>Use clear language and avoid misleading wording.</li>
                            <li>Report problems from the poll's page.</li>
                        </ul>
                    </section>
                    {/* Call to action */}
                    <section
                        className="relative rounded-xl border border-emerald-600/30
                     bg-gradient-to-b from-emerald-900/40 via-zinc-900/40 to-zinc-900/20
                     px-6 py-6 shadow-[0_0_0_1px_rgba(16,185,129,0.08)_inset,0_6px_20px_rgba(16,185,129,0.06)]
                     backdrop-blur-sm">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-emerald-200">Ready to shape Classic+</h2>
                                <p className="mt-1 text-zinc-200">
                                    Add your voice, share polls with your guild, and help build a clear signal the whole
                                    community can stand behind.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                {session ? (
                                    <a
                                        className="inline-flex items-center rounded-lg border border-zinc-600/40 px-4 py-2 text-sm font-medium text-emerald-200 bg-emerald-600/20"
                                    >
                                        You’re signed in.
                                    </a>
                                ) : (
                                    <SignInButton
                                        design='inline-flex items-center rounded-lg border border-zinc-600/40 px-4 py-2 text-sm font-medium text-white font-bold'/>
                                )}
                                <a href="/new-poll"
                                   className="inline-flex items-center rounded-lg border border-zinc-600/40 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-800/60">
                                    Create a poll
                                </a>
                                <a href="/"
                                   className="inline-flex items-center rounded-lg border border-zinc-600/40 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-800/60">
                                    Explore polls
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* Footer note */}
                    <section className="rounded-xl border border-emerald-600/20 bg-zinc-900/40 p-6">
                        <p className="text-xs text-zinc-400 leading-relaxed">
                            This is a community movement and not affiliated with Blizzard Entertainment. World of
                            Warcraft and Blizzard Entertainment are trademarks or registered trademarks of Blizzard
                            Entertainment, Inc.
                        </p>
                    </section>

                </div>
            </main>
        </AdLayout>
    );
}


