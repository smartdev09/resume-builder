import { PrismaAdapter } from "@auth/prisma-adapter"; 
import NextAuth from "next-auth";
import prisma from "./prisma";
import Github from "next-auth/providers/github";
import { Adapter } from "next-auth/adapters";

export const { handlers, signIn, signOut, auth } = NextAuth({
    trustHost: true,
    theme: {
        logo: '' // add logo
    },
    adapter: PrismaAdapter(prisma) as Adapter,
    session: {
        strategy: 'jwt',
    },
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