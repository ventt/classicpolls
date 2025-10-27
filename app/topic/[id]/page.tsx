import { headers } from "next/headers";
import Link from "next/link";
import ShareButton from "@/components/ShareButton"; // ⬅ client component

type TopicDetail = {
    id: string;
    title: string;
    description: string | null;
    category: { name: string } | null;
    stats: { pos: number; neg: number; total: number; ratio: number };
    createdAt: string;
};

/** base URL (env előnyben, különben request header) */
async function getBaseUrl() {
    if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
    const h = await headers(); // ⬅ await headers()
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const proto = h.get("x-forwarded-proto") ?? (process.env.NODE_ENV === "development" ? "http" : "https");
    if (!host) return "http://localhost:3000";
    return `${proto}://${host}`;
}

async function getTopicAbs(id: string): Promise<TopicDetail | null> {
    const base = await getBaseUrl();
    const res = await fetch(`${base}/api/topics/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
}

export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;                   // ⬅ await params
    const data = await getTopicAbs(id);
    if (!data) {
        return (
            <div className="p-6">
                <p className="text-zinc-300">Topic not found.</p>
                <Link href="/" className="text-emerald-400 underline">Back to list</Link>
            </div>
        );
    }

    const base = await getBaseUrl();
    const shareUrl = `${base}/topic/${data.id}`;   // ⬅ abszolút URL a ShareButtonnak
    const posPct = data.stats.total ? Math.round((data.stats.pos / data.stats.total) * 100) : 0;

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">{data.title}</h1>
                    <p className="text-sm text-zinc-400">{data.category?.name}</p>
                </div>
                <ShareButton url={shareUrl} title={data.title} /> {/* ⬅ NINCS onClick a Serverben */}
            </div>

            {data.description && <p className="mt-3 text-zinc-200 leading-relaxed">{data.description}</p>}

            <div className="mt-5">
                <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${posPct}%` }} />
                </div>
                <div className="mt-2 text-sm text-zinc-400">
                    {posPct}% positive • {data.stats.pos} up / {data.stats.neg} down • {data.stats.total} votes
                </div>
            </div>

            <div className="mt-6">
                <Link href="/" className="text-emerald-400 underline">← Back to list</Link>
            </div>
        </div>
    );
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;                    // ⬅ await params
    const base = await getBaseUrl();                // ⬅ await headers() közvetve
    const url = `${base}/topic/${id}`;
    return {
        title: "Topic • WowVotes",
        description: "Community-powered Classic+ ideas: see what players truly want in World of Warcraft.",
        openGraph: { url, type: "article", title: "Topic • WowVotes", description: "Community-powered Classic+ ideas: see what players truly want in World of Warcraft." },
        twitter: { card: "summary", title: "Topic • WowVotes", description: "Community-powered Classic+ ideas: see what players truly want in World of Warcraft." },
    };
}
