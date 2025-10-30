import "./globals.css";
import type {Metadata} from "next";
import React from "react";


export const metadata: Metadata = {
    title: "Classic Polls",
    description: "Community Classic+ voting",
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className="min-h-screen bg-cover bg-center bg-fixed overflow-hidden"
              style={{
                  backgroundImage: "url('/wallpaper.jpg')",
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
