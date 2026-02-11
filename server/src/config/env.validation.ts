
import * as Joi from "joi";

export const envValidationSchema = Joi.object({
    // App
    NODE_ENV: Joi.string()
        .valid("development", "production", "test")
        .default("development"),
    PORT: Joi.number().default(3000),
    API_PREFIX: Joi.string().default("api/v1"),
    CORS_ORIGIN: Joi.string().default("*"),

    // Database
    DATABASE_URL: Joi.string().required().description("PostgreSQL Connection String"),

    // Redis
    // Redis
    REDIS_HOST: Joi.string().empty("").default("localhost"),
    REDIS_PORT: Joi.number().empty("").default(6379),
    REDIS_PASSWORD: Joi.string().allow("").optional(),

    // JWT
    JWT_ACCESS_SECRET: Joi.string()
        .required()
        .min(10)
        .description("Secret key for signing access tokens"),
    JWT_ACCESS_EXPIRY: Joi.string().default("15m"),
    JWT_REFRESH_SECRET: Joi.string() // Neon/Prisma adapter doesn't use this directly but good to have if we expand
        .default("default-refresh-secret-if-not-used"),
    // Wait, the service generates a random UUID for refresh token, but doesn't sign it with a secret?
    // Looking at auth.service.ts:
    // const refreshToken = uuid(); 
    // It does NOT use jwt.sign for refresh token.
    // So JWT_REFRESH_SECRET might not be strictly required by the *current* code, 
    // but the .env.example had it. 
    // Let's verify auth.module.ts again.
    // Ah, auth.module.ts only uses JWT_ACCESS_SECRET. 
    // But let's keep it safe. If the user *thinks* they need it. 
    // Actually, let's look at auth.service.ts again. 
    // It uses `uuid` for refresh token. 
    // So JWT_REFRESH_SECRET is unused. 
    // I will make it optional or remove it from requirement to avoid false positives if the user didn't set it.
    // But wait, the .env.example has it.
    // Let's make it optional for now to be safe, or just string.

    // Let's check auth.service.ts imports again.
    // It imports ConfigService. 
    // It uses `JWT_ACCESS_SECRET` and `JWT_ACCESS_EXPIRY`.
    // It uses `JWT_REFRESH_EXPIRY`.
    // It DOES NOT use `JWT_REFRESH_SECRET`.

    // So I will make JWT_ACCESS_SECRET required.
});
