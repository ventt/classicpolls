// lib/auth.ts
import NextAuth, {getServerSession, type NextAuthOptions} from "next-auth";
import Discord from "next-auth/providers/discord";


export const authOptions: NextAuthOptions = {
    // TODO adapter:
    session: {strategy: "jwt"},

    providers: [
        Discord({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
            authorization: {params: {scope: "identify email"}},
        }),
    ],

    callbacks: {
        async session({session, token}) {
            if (session.user && token?.sub) {
                (session.user as any).id = token.sub;
                // @ts-ignore
                console.log(session.user)
                console.log(token)
            }
            return session;
        },
    },
    // @ts-ignore
    trustHost: true,
};

export const nextAuthHandler = NextAuth(authOptions);
export const getServerAuth = () => getServerSession(authOptions);
