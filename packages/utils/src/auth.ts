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
            return session;
          },
          async jwt({ token, user, account, profile }) {
            console.log('jwt', token, account)
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
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
        authorization: {
            params: {
                scope: 'public_repo' // Add this scope
            }
        }
    })],
})