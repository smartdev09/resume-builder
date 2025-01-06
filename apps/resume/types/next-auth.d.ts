import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: User & DefaultSession["user"];
        accessToken: string
    }

    interface User {
        role: string | null;
    }
}