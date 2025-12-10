"use client";

export default function LoadingPollCard() {

    return (
        <li className="flex flex-col min-w-0 border rounded-xl p-4 ${cardBg} shadow-sm transition border-gray-600/70 bg-gray-900/20">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 w-full">
                    <div
                        className=" animate-pulse font-semibold text-lg text-white truncate w-full h-6 rounded bg-gray-600">
                    </div>

                    <div className="animate-pulse flex items-center gap-2 h-2 my-3 w-40 rounded bg-gray-400">
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">

                </div>
            </div>

            <div className="flex flex-col mt-2">
                <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all ease-out duration-500"
                         style={{width: `0%`}}/>
                </div>
                <div className="mt-1 text-xs text-zinc-400 flex items-center gap-3">
                    <div className="animate-pulse  opacity-70">Loading ...
                    </div>
                </div>
            </div>
        </li>
    );
}
