import { z } from "zod";

const publicSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_URL: z.string().url(),
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().min(1),
    NEXT_PUBLIC_GOOGLE_REDIRECT_URI: z.string().optional(),
    NEXT_PUBLIC_API_ENDPOINT: z.string().url().optional(),
});

const rawPublic = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_REDIRECT_URI: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
    NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
};

const publicEnv = publicSchema.safeParse(rawPublic);

if (!publicEnv.success) {
    console.error("Invalid public environment variables:", publicEnv.error.format());
    throw new Error("Invalid public environment variables");
}

export const envPublic = publicEnv.data;
