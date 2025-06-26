import { z } from "zod";

const serverSchema = z.object({
    NEXTAUTH_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    BACKEND_URL: z.string().url(),
    NEXT_PUBLIC_API_URL: z.string().url(),
});

const rawServer = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    BACKEND_URL: process.env.BACKEND_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
};

const serverEnv = serverSchema.safeParse(rawServer);

if (!serverEnv.success) {
    console.error("Invalid server environment variables:", serverEnv.error.format());
    throw new Error("Invalid server environment variables");
}

export const envServer = serverEnv.data;
