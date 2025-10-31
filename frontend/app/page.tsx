import SiteHeader from "@/components/SiteHeader";
import AdLayout from "@/app/ad-layout";
import {fetchCategories} from "@/lib/postgrest/category";
import PollList from "@/components/PollList";
import {fetchPollsDetails} from "@/app/actions";
import {getServerAuth} from "@/lib/auth";
import Link from "next/link";


export default async function Page() {
    const initPageSize = 20
    const categories = await fetchCategories();
    const session = await getServerAuth();
    const pollDetails = await fetchPollsDetails(initPageSize, 0, 'approval_score', false);

    return (
        <AdLayout>
            <main className="col-span-12 lg:col-span-8 flex flex-col gap-4 overflow-hidden">
                <SiteHeader/>
                <section
                    className="relative rounded-xl border border-emerald-600/30
                           bg-gradient-to-b from-emerald-900/30 via-zinc-900/30 to-zinc-900/20
                           px-4 py-3 shadow-[0_0_0_1px_rgba(16,185,129,0.08)_inset,0_6px_20px_rgba(16,185,129,0.06)]
                           backdrop-blur-sm">
                    <p className="flex flex-wrap items-center gap-2 text-sm leading-relaxed text-center justify-center">
                        <span className="font-semibold text-zinc-100">
                             Community-powered <span
                            className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-lime-300 to-emerald-400">Classic+</span> vision — where players imagine and shape the World of Warcraft they truly want!
                            <Link href={"/learn-more"}
                                  className="hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-emerald-200 hover:via-lime-300 hover:to-emerald-400 text-emerald-400"> Learn more!</Link>
                        </span>
                    </p>
                </section>
                <PollList initPollDetailsList={pollDetails.data} initTotal={pollDetails.count}
                          initPageSize={initPageSize} categories={categories} userSub={session?.user.id}/>
            </main>
        </AdLayout>
    );
}

