import Discord from "next-auth/providers/discord";
import {importJWK, JWK, SignJWT} from "jose";
import {postgrestWithToken} from "@/lib/postgrest";
import NextAuth, {getServerSession, NextAuthOptions, User} from "next-auth";


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
            authorization: {params: {scope: "identify"}},
        }),
    ],

    callbacks: {
        async session({session, token}) {
            if (token.accessToken) {
                // @ts-ignore
                session.accessToken = token.accessToken;

            }

            if (token.sub) {
                session.user.id = token.sub;
            }

            return session
        },
        async jwt({token, user}) {

            if (user) {
                const accessToken = await encrypt(user);

                // Update user in api
                await postgrestWithToken(accessToken).rpc('update_user')

                token.accessToken = accessToken;
            }

            return token
        }
    }
};

export const nextAuthHandler = NextAuth(authOptions);
export const getServerAuth = () => getServerSession(authOptions);
