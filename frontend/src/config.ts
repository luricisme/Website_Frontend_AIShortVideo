import { z } from "zod";

const configSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_URL: z.string().url(),
});

const rawConfig = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
};

const configProject = configSchema.safeParse(rawConfig);

if (!configProject.success) {
    console.error("Invalid environment variables:", configProject.error.format());
    throw new Error("Invalid environment variables");
}

const envConfig = configProject.data;

export default envConfig;
