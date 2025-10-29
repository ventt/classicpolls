import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import ShareButton from "@/components/ShareButton";
import PollInteractions from "@/app/poll/PollInteractions";
import SiteHeader from "@/components/SiteHeader";
import ReportButton from "@/components/ReportButton";
import AdLayout from "@/app/ad-layout";
import {fetchPollDetails} from "@/lib/postgrest/poll-details";
import {fetchVoteDetails, VoteDetails} from "@/app/poll/vote-details";
import {getServerSession} from "next-auth";

export default async function PollPage({params}: {params: Promise<{ id: string }>;}){
    const { id } = await params;
    const pollDetails = await fetchPollDetails(id);
    if (!pollDetails) notFound();
    const votes  = await fetchVoteDetails(pollDetails.id, 6);
    const session = await getServerSession()
    // const shareUrl = `${base}/topic/${data.id}`;

    return (
        <AdLayout>
            <main className="col-span-12 lg:col-span-8 flex flex-col gap-4">
                <SiteHeader />

                <div className="flex items-start justify-between gap-4 mt-2">
                    <div className="min-w-0">
                        <h1 className="text-2xl md:text-3xl font-bold text-white">
                            {pollDetails.title}
                        </h1>
                        <p className="text-sm text-zinc-400">{pollDetails.category_name}</p>
                    </div>
                    <div className="flex gap-2">
                        <ShareButton url="" title={pollDetails.title} />
                        <ReportButton topicId={pollDetails.id}/>
                    </div>
                </div>

                {pollDetails.description && (
                    <p className="mt-3 text-zinc-200 leading-relaxed">{pollDetails.description}</p>
                )}

                <PollInteractions poll_details={pollDetails} votes={votes} session={session} />

                <div className="mt-6">
                    <Link href="/" className="text-emerald-400 underline">
                        ← Back to list
                    </Link>
                </div>
            </main>
        </AdLayout>
    );
}