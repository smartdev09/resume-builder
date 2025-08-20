import { PrismaAdapter } from "@auth/prisma-adapter"; 
import NextAuth from "next-auth";
import { prisma } from "@resume/db";
import Github from "next-auth/providers/github";
import { Adapter } from "next-auth/adapters";

// Helper function to get the domain for cookie sharing
const getDomainWithoutSubdomain = (url: string) => {
    const urlParts = new URL(url).hostname.split('.');
    return urlParts
        .slice(0)
        .slice(-(urlParts.length === 4 ? 3 : 2))
        .join('.');
};

const useSecureCookies = process.env.NEXTAUTH_URL?.startsWith('https://') ?? false;
const cookiePrefix = useSecureCookies ? '__Secure-' : '';
const hostName = getDomainWithoutSubdomain(process.env.NEXTAUTH_URL || 'http://localhost:3000');

// Configure cookies to be shared across localhost ports
const cookies = {
    sessionToken: {
        name: `${cookiePrefix}next-auth.session-token`,
        options: {
            httpOnly: true,
            sameSite: 'lax' as const,
            path: '/',
            secure: useSecureCookies,
            domain: hostName === 'localhost' ? 'localhost' : '.' + hostName
        },
    },
};

export const { handlers, signIn, signOut, auth } = NextAuth({
    trustHost: true,
    theme: {
        logo: '' // add logo
    },
    //@ts-ignore
    adapter: PrismaAdapter(prisma) as Adapter,
    session: {
        strategy: 'jwt',
    },
    cookies,
    callbacks: {
        async session({ session, token, user }) {
            //@ts-ignore
            session.accessToken = token.accessToken;
            session.user.id = token.sub!;
            return session;
          },
          async jwt({ token, user, account, profile }) {
            if (account) {
              token.accessToken = account.access_token;
            }
            return token;
          },
          async redirect({ url, baseUrl }) {
            return baseUrl + '/editor'
          }
    },
    providers: [Github({
        clientId: process.env.AUTH_GITHUB_ID,
        clientSecret: process.env.AUTH_GITHUB_SECRET,
        authorization: {
            params: {
                scope: 'user:email' // Add this scope
            }
        }
    })],
})