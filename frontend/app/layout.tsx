import "./globals.css";
import type {Metadata, Viewport} from "next";
import React from "react";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
    title: "Classic Polls - The Classic+ voting site",
    alternates: {canonical: "/"},
    description: "Community-created Classic+ vision polls allowing players to vote on feature ideas and see how the wider WoW community feels about them.",
    appleWebApp: {capable: true, title: "Classic Polls", statusBarStyle: "black-translucent"},
};
export const viewport: Viewport = {
    themeColor: "#130a03"
}
export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className="min-h-screen bg-gradient-to-t from-yellow-950 via-emerald-900 to-yellow-950 lg:bg-[url(/wallpaper.webp)] lg:bg-cover sm:bg-center lg:bg-fixed lg:bg-no-repeat
                            overflow-y-auto scrollbar scrollbar-thumb-rounded scrollbar-thumb-emerald-900 scrollbar-track-rounded scrollbar-track-zinc-900"
        >
        <div className="min-h-screen bg-black/60 lg:bg-black/70 backdrop-blur-sm">
            <div
                className="flex flex-col w-full pt-1 md:pt-4 lg:pt-2 pr-2 pl-2 md:pr-4 md:pl-4 lg:pr-0 lg:pl-0 lg:m-0 lg:w-[68%] gap-2 justify-self-center">
                <SiteHeader/>
                <main className="flex flex-col gap-4 pt-1 lg:pt-2 pb-6 lg:pb-0">
                    {children}
                </main>
            </div>
        </div>
        </body>
        </html>
    );
}