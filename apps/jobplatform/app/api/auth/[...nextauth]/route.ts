import NextAuth from "next-auth";

console.log("🔧 NextAuth v5 beta setup for app #2 (job platform)...");

// Simple cookie configuration for localhost sharing
const cookies = {
    sessionToken: {
        name: "next-auth.session-token",
        options: {
            httpOnly: true,
            sameSite: 'lax' as const,
            path: '/',
            secure: false, // false for localhost
            domain: 'localhost' // share across localhost ports
        },
    },
};

const authOptions = {
    trustHost: true,
    secret: process.env.NEXTAUTH_SECRET,
    cookies,
    session: {
        strategy: 'jwt' as const,
    },
    providers: [],
    callbacks: {
        async jwt({ token }: { token: any }) {
            console.log("🎫 Simple JWT callback:", { hasToken: !!token, email: token?.email });
            return token;
        },
        async session({ session, token }: { session: any; token: any }) {
            console.log("📝 Simple session callback:", { 
                hasSession: !!session, 
                hasToken: !!token,
                userEmail: token?.email 
            });
            if (token?.sub) {
                session.user.id = token.sub;
            }
            if (token?.accessToken) {
                session.accessToken = token.accessToken;
            }
            console.log("📝 Session callback result:", {
                userId: session?.user?.id,
                userEmail: session?.user?.email
            });
            return session;
        },
    }
};

console.log("🚀 Creating NextAuth handler with cookie sharing...");

const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

console.log("✅ NextAuth handler created with cookie sharing");

export const { GET, POST } = handlers; 