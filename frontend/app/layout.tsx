import "./globals.css";
import { Providers } from "./providers"; // csak ha használod a next-auth SessionProvider-t
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Wow Votes",
    description: "Community Classic+ voting",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body
            className="min-h-screen text-gray-100 bg-cover bg-center bg-fixed"
            style={{
                backgroundImage: "url('/wallpaper.jpg')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundAttachment: "fixed",
            }}
        >
        {/* Overlay a jobb olvashatóságért */}
        <div className="min-h-screen bg-black/70 backdrop-blur-sm">
            <Providers>{children}</Providers>
            {/* ha nincs next-auth SessionProvider, akkor csak:
              {children}
          */}
        </div>
        </body>
        </html>
    );
}
