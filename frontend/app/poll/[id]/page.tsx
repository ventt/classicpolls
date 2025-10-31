import Link from "next/link";
import {notFound} from "next/navigation";
import ShareButton from "@/components/ShareButton";
import PollInteractions from "@/app/poll/PollInteractions";
import SiteHeader from "@/components/SiteHeader";
import ReportButton from "@/components/ReportButton";
import {fetchPollDetails} from "@/lib/postgrest/poll-details";
import {fetchVoteDetails} from "@/app/poll/vote-details";
import {getServerSession} from "next-auth";
import {headers} from "next/headers";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AdLessLayout from "@/app/adless-layout";

export default async function PollPage({params}: {params: Promise<{ id: string }>;}){
    const { id } = await params;
    const pollDetails = await fetchPollDetails(id);
    if (!pollDetails) notFound();
    const votes  = await fetchVoteDetails(pollDetails.id, 6);
    const session = await getServerSession()

    // Getting share URL
    const host = (await headers()).get("host");
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const shareUrl = `${protocol}://${host}/poll/${pollDetails.id}`;

    return (
        <AdLessLayout>
            <main className="col-span-12 lg:col-span-8 flex flex-col gap-4 p-1">
                <SiteHeader />

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
            </main>
        </AdLessLayout>
    );
}