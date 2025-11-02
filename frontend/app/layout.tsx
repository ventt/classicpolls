import "./globals.css";
import type {Metadata, Viewport} from "next";
import React from "react";


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
        <body className="bg-gradient-to-t from-lime-900 via-emerald-800 to-yellow-950 sm:bg-[url(/wallpaper.webp)] sm:bg-cover sm:bg-center sm:bg-fixed sm:bg-no-repeat
                            overflow-y-auto scrollbar scrollbar-thumb-rounded scrollbar-thumb-emerald-900 scrollbar-track-rounded scrollbar-track-zinc-900"
        >
        <div className="bg-black/70 backdrop-blur-sm ">
            {children}
        </div>
        </body>
        </html>
    );
}
// 19 10 3
// yellow-950
// emerald-300
// lime-300
//67,47,21