import Link from "next/link";
import {notFound} from "next/navigation";
import ShareButton from "@/components/ShareButton";
import PollInteractions from "@/app/poll/PollInteractions";
import ReportButton from "@/components/ReportButton";
import {fetchPollDetails} from "@/lib/postgrest/poll-details";
import {fetchVoteDetails} from "@/app/poll/vote-details";
import {getServerSession} from "next-auth";
import {headers} from "next/headers";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {PollDetails} from "@/lib/model/poll-details";

function getAbsoluteUrl(id: string, host: string) {
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    return `${protocol}://${host}/poll/${id}`;
}

function jsonLdForPoll(pollDetails: PollDetails, url: string) {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        about: {
            "@type": "VideoGame",
            name: "World of Warcraft Classic"
        },
        audience: {
            "@type": "Audience",
            audienceType: "Gamers"
        },
        datePublished: pollDetails.created_at,
        mainEntity: {
            "@type": "Question",
            name: pollDetails.title,
            text: pollDetails.description ?? undefined,
            description: "A community-created poll surveying the wider World of Warcraft playerbase about the WoW Classic+ features they would most like to see added to the game.",
            url: url,
            upvoteCount: pollDetails.upvotes,
            downvoteCount: pollDetails.downvotes,
            answerCount: pollDetails.total_votes,
            interactionStatistic: [
                {
                    "@type": "InteractionCounter",
                    interactionType: {"@type": "VoteAction"},
                    userInteractionCount: pollDetails.total_votes,
                },
                {
                    "@type": "InteractionCounter",
                    interactionType: {"@type": "LikeAction"},
                    userInteractionCount: pollDetails.upvotes,
                },
                {
                    "@type": "InteractionCounter",
                    interactionType: {"@type": "DislikeAction"},
                    userInteractionCount: pollDetails.downvotes,
                },
            ],
        },
        isPartOf: {
            "@type": "CollectionPage",
            name: "Classic Polls",
        },
    };
}

export async function generateMetadata({params}: { params: { id: string } }) {
    const {id} = await params;
    const pollDetails = await fetchPollDetails(id);

    if (!pollDetails) {
        return {
            title: "Poll not found",
            robots: {
                index: false,
                follow: false,
            }
        }
    }

    const title = `${pollDetails.title ?? "Classic+ poll"} | Classic Polls`;
    const description = `A community vote on visionary Classic+ feature | ${pollDetails.title}`;
    const host = (await headers()).get("host") ?? "";
    const url = getAbsoluteUrl(id, host);
    return {
        title: title,
        description: description,
        alternates: {canonical: url},
        openGraph: {
            type: "website",
            url: url,
            title: title,
            description: description,
        },
        twitter: {
            title,
            description: description,
        },
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        }
    }
}

export default async function PollPage({params}: { params: Promise<{ id: string }>; }) {
    const {id} = await params;
    const pollDetails = await fetchPollDetails(id);
    if (!pollDetails) notFound();
    const votes = await fetchVoteDetails(pollDetails.id, 6);
    const session = await getServerSession()

    // Getting share URL
    const host = (await headers()).get("host") ?? "";
    const shareUrl = getAbsoluteUrl(pollDetails.id, host);


    return (
        <>
            <div className="flex items-start justify-between gap-4 mt-2">
                <div className="min-w-0">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                        {pollDetails.title}
                    </h1>
                    <p className="text-sm text-zinc-400">{pollDetails.category_name}</p>
                </div>
                <div className="flex gap-2">
                    <ShareButton url={shareUrl} title={pollDetails.title}/>
                    <ReportButton topicId={pollDetails.id}/>
                </div>
            </div>
            <div
                className="h-64 w-f overflow-y-auto scrollbar scrollbar-thumb-rounded scrollbar-thumb-emerald-900 scrollbar-track-rounded scrollbar-track-zinc-900 border  rounded-lg border-zinc-800 p-6">
                {pollDetails.description ? (

                    <article
                        className="prose prose-sm prose-slate prose-invert">
                        <Markdown remarkPlugins={[remarkGfm]}>{pollDetails.description}</Markdown>
                    </article>

                ) : (
                    <article className="prose prose-sm prose-slate prose-invert">
                        No Description
                    </article>
                )}
            </div>

            <PollInteractions initialPollDetails={pollDetails} votes={votes} session={session}/>

            <div className="mt-6">
                <Link href="/" className="text-emerald-400 underline">
                    ← Back to list
                </Link>
            </div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLdForPoll(pollDetails, shareUrl)).replace(/</g, '\\u003c'),
                }}
            />
        </>
    );
}