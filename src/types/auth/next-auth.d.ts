import { DefaultSession } from "next-auth";
import { JWT as NextAuthJWT } from "next-auth/jwt";

declare module "next-auth" {
    /**
     * Extends NextAuth's default Session type
     */
    interface Session {
        accessToken: string;
        refreshToken?: string;
        error?: string;
        user: {
            id: string;
            name?: string;
            email: string;
            role: string;
            image?: string;
        } & DefaultSession["user"];
    }

    /**
     * Extends NextAuth's default User type
     */
    interface User {
        id: string;
        name?: string;
        email: string;
        role: string;
        image?: string;
        accessToken: string;
        refreshToken?: string;
        accessTokenExpires: number;
    }
}

declare module "next-auth/jwt" {
    /**
     * Extends NextAuth's default JWT type
     */
    interface JWT extends NextAuthJWT {
        id: string;
        accessToken: string;
        refreshToken?: string;
        role: string;
        accessTokenExpires: number;
        error?: string;
    }
}
