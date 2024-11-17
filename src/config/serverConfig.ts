import { z } from 'zod';

const ServerConfigSchema = z.object({
  //BASE_URL: z.string().url(),
  DB_URL: z.string().url(),
  DB_NAME: z.string().trim().min(1),
  JWT_SECRET: z.string().trim(),
  // REFRESH_TOKEN_SECRET: z.string().trim(),
  NODE_ENV: z
    .union([
      z.literal("production"),
      z.literal("development"),
      z.literal("test"),
    ])
    .default("development"),
});

export default ServerConfigSchema.parse(process.env);
