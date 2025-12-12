import {fetchCategories} from "@/lib/postgrest/category";
import {getServerAuth} from "@/lib/auth";
import Link from "next/link";
import {PollDetails} from "@/lib/model/poll-details";
import {headers} from "next/headers";
import {defaults, OrderByOptions} from "@/app/poll-details-request-helper";
import PollListContainer from "@/components/PollListContainer";
import {fetchPollsDetails} from "@/lib/data/poll-details";


function jsonLdForPollList(polls: PollDetails[], host: string) {
    return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Classic Polls",
        description:
            "Community-created Classic+ vision polls allowing players to vote on feature ideas and see how the wider WoW community feels about them. Classic+ survey.",
        mainEntity: {
            "@type": "ItemList",
            itemListOrder: "https://schema.org/ItemListOrderAscending",
            numberOfItems: polls.length,
            itemListElement: polls.map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `${host}/poll/${p.id}`,
                item: {
                    "@type": "Thing",
                    "@id": `${host}/poll/${p.id}`,
                    name: p.title,
                    description: p.description ?? undefined,
                    url: `${host}/poll/${p.id}`,
                    interactionStatistic: [
                        {
                            "@type": "InteractionCounter",
                            interactionType: {"@type": "VoteAction"},
                            userInteractionCount: p.total_votes,
                        },
                    ],
                },
            })),
        },
    };
}

export default async function Page({
                                       searchParams,
                                   }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const {
        limit = String(defaults.limit),
        offset = '0',
        orderBy = defaults.orderBy,
        category = null,
        searchTerm = null
    } = await searchParams;

    const categories = await fetchCategories();
    const session = await getServerAuth();
    const pollDetails = await fetchPollsDetails(
        Number(limit),
        Number(offset),
        OrderByOptions.get(orderBy as string)!!.orderBy,
        OrderByOptions.get(orderBy as string)!!.ascending,
        category as string | null,
        searchTerm as string | null,
    );
    const host = (await headers()).get("host") ?? "";

    return (
        <>
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
            <PollListContainer initPollDetailsList={pollDetails.data}
                               initTotal={pollDetails.count}
                               categories={categories}
                               userSub={session?.user.id}/>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLdForPollList(pollDetails.data, host)).replace(/</g, '\\u003c'),
                }}
            />
        </>
    );
}

