'use server';

import React from "react";

export default async function AdLayout({children}: { children: React.ReactNode }) {
    return (
        <>
            <div className="min-h-screen grid grid-cols-12 gap-4 p-4">
                <aside
                    className="hidden lg:block col-span-2 sticky top-19 h-[80vh] border border-zinc-800 rounded-xl bg-zinc-900/50 backdrop-blur-sm items-center justify-center">
                    <span className="text-zinc-400">Ad</span>
                </aside>
                {children}
                <aside
                    className="hidden lg:block col-span-2 sticky top-19 h-[80vh] border border-zinc-800 rounded-xl bg-zinc-900/50 backdrop-blur-sm items-center justify-center">
                    <span className="text-zinc-400">Ad</span>
                </aside>
            </div>
        </>
    )
}