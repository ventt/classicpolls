import "./globals.css";
import type {Metadata} from "next";
import React from "react";


export const metadata: Metadata = {
    title: "Classic Polls - The Classic+ voting site",
    alternates: {canonical: "/"},
    description: "Community-created Classic+ vision polls allowing players to vote on feature ideas and see how the wider WoW community feels about them.",
    appleWebApp: {capable: true, title: "Classic Polls", statusBarStyle: "black-translucent"}
};
export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className="min-h-screen bg-cover bg-center bg-fixed"
              style={{
                  backgroundImage: "url('/wallpaper.webp')",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundAttachment: "fixed",
              }}>
        <div className="min-h-screen bg-black/70 backdrop-blur-sm">
            {children}
        </div>
        </body>
        </html>
    );
}
