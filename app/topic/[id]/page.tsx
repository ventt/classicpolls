import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import ShareButton from "@/components/ShareButton";
import TopicInteractions from "@/components/TopicInteractions";
import SiteHeader from "@/components/SiteHeader";
import ReportButton from "@/components/ReportButton"; // ✅ reuse shared header

type TopicDetail = {
    id: string;
    title: string;
    description: string | null;
    category: { name: string } | null;
    stats: { pos: number; neg: number; total: number; ratio: number };
    createdAt: string;
};

/** base URL helper */
async function getBaseUrl() {
    if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const proto =
        h.get("x-forwarded-proto") ??
        (process.env.NODE_ENV === "development" ? "http" : "https");
    if (!host) return "http://localhost:3000";
    return `${proto}://${host}`;
}

/** topic fetch */
async function getTopicAbs(id: string): Promise<TopicDetail | null> {
    const base = await getBaseUrl();
    const res = await fetch(`${base}/api/topics/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
}

export default async function TopicPage({
                                            params,
                                        }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const data = await getTopicAbs(id);
    if (!data) notFound();

    const base = await getBaseUrl();
    const shareUrl = `${base}/topic/${data.id}`;

    return (
        <div className="min-h-screen grid grid-cols-12 gap-4 p-4">
            {/* LEFT AD — same as homepage */}
            <aside className="hidden lg:block col-span-2 sticky top-4 h-[80vh] border border-zinc-800 rounded-xl bg-zinc-900/50 backdrop-blur-sm flex items-center justify-center">
                <span className="text-zinc-400">Ad</span>
            </aside>

            {/* MAIN CONTENT */}
            <main className="col-span-12 lg:col-span-8 flex flex-col gap-4">
                <SiteHeader />

                <div className="flex items-start justify-between gap-4 mt-2">
                    <div className="min-w-0">
                        <h1 className="text-2xl md:text-3xl font-bold text-white">
                            {data.title}
                        </h1>
                        <p className="text-sm text-zinc-400">{data.category?.name}</p>
                    </div>
                    <div className="flex gap-2">
                        <ShareButton url={shareUrl} title={data.title} />
                        <ReportButton topicId={data.id}/>
                    </div>
                </div>

                {data.description && (
                    <p className="mt-3 text-zinc-200 leading-relaxed">{data.description}</p>
                )}

                {/* Interactive voting + recent voters */}
                <TopicInteractions topicId={data.id} initialStats={data.stats} />

                <div className="mt-6">
                    <Link href="/" className="text-emerald-400 underline">
                        ← Back to list
                    </Link>
                </div>
            </main>

            {/* RIGHT AD — same as homepage */}
            <aside className="hidden lg:block col-span-2 sticky top-4 h-[80vh] border border-zinc-800 rounded-xl bg-zinc-900/50 backdrop-blur-sm flex items-center justify-center">
                <span className="text-zinc-400">Ad</span>
            </aside>
        </div>
    );
}

/** SEO metadata */
export async function generateMetadata({
                                           params,
                                       }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const base = await getBaseUrl();
    const url = `${base}/topic/${id}`;

    return {
        title: "Topic • WowVotes",
        description:
            "Community-powered Classic+ ideas: see what players truly want in World of Warcraft.",
        openGraph: {
            url,
            type: "article",
            title: "Topic • WowVotes",
            description:
                "Community-powered Classic+ ideas: see what players truly want in World of Warcraft.",
        },
        twitter: {
            card: "summary",
            title: "Topic • WowVotes",
            description:
                "Community-powered Classic+ ideas: see what players truly want in World of Warcraft.",
        },
    };
}
