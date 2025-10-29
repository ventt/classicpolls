// lib/auth.ts
import NextAuth, {getServerSession, type NextAuthOptions, User} from "next-auth";
import Discord from "next-auth/providers/discord";
import {importJWK, JWK, SignJWT} from "jose";
import {postgrest} from "@/lib/postgrest";

// @ts-ignore
const jwk = JSON.parse(process.env.API_JWK) as JWK;
const key = importJWK(jwk);

async function encrypt(user: User) {
    return new SignJWT({
        sub: user.id,
        role: 'web_user',
        name: user.name,
        image: user.image,
    })
        .setProtectedHeader({alg: 'RS256'})
        .setIssuedAt()
        .setExpirationTime('1y')
        .sign(await key)
}

export const authOptions: NextAuthOptions = {
    session: {strategy: "jwt"},

    providers: [
        Discord({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
            authorization: {params: {scope: "identify email"}},
        }),
    ],

    callbacks: {
        async jwt({token, user}) {
            // Create encrypted API token on sign in
            if (user) {
                const apiToken = await encrypt(user);
                token.apiToken = apiToken;

                // Update user in api
                await postgrest(apiToken).rpc('update_user')
            }
            return token;
        }
    },
    // @ts-ignore
    trustHost: true,
};

export const nextAuthHandler = NextAuth(authOptions);
export const getServerAuth = () => getServerSession(authOptions);
