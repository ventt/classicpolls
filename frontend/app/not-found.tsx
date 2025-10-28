import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center p-6">
            <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-950/60 backdrop-blur-sm p-8 text-center shadow-[0_0_0_1px_rgba(16,185,129,0.06)_inset,0_20px_60px_rgba(16,185,129,0.04)]">
                <h1 className="text-3xl font-extrabold text-white">
                    404 — <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-lime-300 to-emerald-400">Not&nbsp;Found</span>
                </h1>

                <p className="mt-3 text-zinc-300">
                    Spirits may not be with you...
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition"
                    >
                        Hearthstone
                    </Link>
                </div>
            </div>
        </div>
    );
}
