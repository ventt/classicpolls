// app/layout.tsx
import "./globals.css"
import { Providers } from "./providers"; // csak ha használod a next-auth SessionProvider-t
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "WowVotes",
    description: "Discord szavazó onepager",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="hu">
        <body className="min-h-screen bg-gray-50">
        {/* ha next-auth SessionProvider van */}
        <Providers>{children}</Providers>

        {/* ha nincs next-auth SessionProvider, csak simán: */}
        {/* {children} */}
        </body>
        </html>
    );
}
