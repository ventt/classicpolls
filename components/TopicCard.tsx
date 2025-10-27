"use client";

type Topic = {
    id: string;
    title: string;
    description?: string | null;
    category?: { name: string };
    stats: { pos: number; neg: number; total: number; ratio: number };
};

export default function TopicCard({
                                      topic,
                                      onVote,
                                      loggedIn,
                                  }: {
    topic: Topic;
    onVote: (topicId: string, value: 1 | -1) => void;
    loggedIn: boolean;
}) {
    const { id, title, description, category, stats } = topic;
    const total = Math.max(stats.total, 0);
    const posPct = total ? Math.round((stats.pos / total) * 100) : 0;

    // color logic
    let borderClass = "border-zinc-700";
    let cardBg = "bg-zinc-900/60";
    if (stats.ratio < 0.4) {
        borderClass = "border-red-600/70";
        cardBg = "bg-zinc-900/80";
    } else if (stats.ratio < 0.7) {
        borderClass = "border-yellow-600/70";
        cardBg = "bg-zinc-900/70";
    } else {
        borderClass = "border-green-600/70";
        cardBg = "bg-emerald-900/20";
    }

    return (
        <li className={`border ${borderClass} rounded-xl p-4 ${cardBg} shadow-sm transition`}>
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="font-semibold text-lg text-white truncate">{title}</h3>
                    <p className="text-sm text-zinc-400">{category?.name}</p>
                </div>

                {/* only show vote buttons if logged in */}
                {loggedIn && (
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            aria-label="Upvote"
                            className="p-2 rounded-lg border border-emerald-700/60 bg-emerald-900/30 hover:bg-emerald-800/50 active:scale-95 transition"
                            onClick={() => onVote(id, 1)}
                            title="Upvote"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-emerald-400">
                                <path d="M12 4l-7 8h4v8h6v-8h4l-7-8z" fill="currentColor" />
                            </svg>
                        </button>
                        <button
                            aria-label="Downvote"
                            className="p-2 rounded-lg border border-red-700/60 bg-red-900/30 hover:bg-red-800/50 active:scale-95 transition"
                            onClick={() => onVote(id, -1)}
                            title="Downvote"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-red-400">
                                <path d="M12 20l7-8h-4V4H9v8H5l7 8z" fill="currentColor" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {description ? <p className="text-sm text-zinc-300 mt-2">{description}</p> : null}

            {/* ratio bar */}
            <div className="mt-3">
                <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${posPct}%` }} />
                </div>

                {/* footer stats: only show arrows if logged in */}
                <div className="mt-1 text-xs text-zinc-400 flex items-center gap-3">
                    {loggedIn && (
                        <>
                            <div className="flex items-center gap-1">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-emerald-400">
                                    <path d="M12 4l-7 8h4v8h6v-8h4l-7-8z" fill="currentColor" />
                                </svg>
                                <span>{stats.pos}</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-red-400">
                                    <path d="M12 20l7-8h-4V4H9v8H5l7 8z" fill="currentColor" />
                                </svg>
                                <span>{stats.neg}</span>
                            </div>
                        </>
                    )}

                    <div className="opacity-70">
                        {posPct}% positive
                    </div>
                </div>
            </div>
        </li>
    );
}
