// lib/auth.ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import Discord from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";


export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" }, // egyszerű és elég

    providers: [
        Discord({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
            authorization: { params: { scope: "identify email" } },
        }),
    ],

    callbacks: {
        async session({ session, token }) {
            // token.sub a felhasználó saját id-je
            if (session.user && token?.sub) {
                (session.user as any).id = token.sub;
            }
            return session;
        },
    },
    // @ts-ignore
    trustHost: true,
};

export const nextAuthHandler = NextAuth(authOptions);
export const getServerAuth = () => getServerSession(authOptions);
