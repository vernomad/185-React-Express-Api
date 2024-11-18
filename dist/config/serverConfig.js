"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const ServerConfigSchema = zod_1.z.object({
    //BASE_URL: z.string().url(),
    DB_URL: zod_1.z.string().url(),
    DB_NAME: zod_1.z.string().trim().min(1),
    JWT_SECRET: zod_1.z.string().trim(),
    // REFRESH_TOKEN_SECRET: z.string().trim(),
    NODE_ENV: zod_1.z
        .union([
        zod_1.z.literal("production"),
        zod_1.z.literal("development"),
        zod_1.z.literal("test"),
    ])
        .default("development"),
});
exports.default = ServerConfigSchema.parse(process.env);
