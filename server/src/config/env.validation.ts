
import * as Joi from "joi";

export const envValidationSchema = Joi.object({
    // ── App ─────────────────────────────────────────
    NODE_ENV: Joi.string()
        .valid("development", "production", "test")
        .default("development"),
    PORT: Joi.number().default(3000),
    API_PREFIX: Joi.string().default("api"),
    CORS_ORIGIN: Joi.string().default("*"),

    // ── Database ─────────────────────────────────────
    DATABASE_URL: Joi.string().required().description("PostgreSQL Connection String"),

    // ── Redis ─────────────────────────────────────────
    REDIS_HOST: Joi.string().empty("").default("localhost"),
    REDIS_PORT: Joi.number().empty("").default(6379),
    REDIS_PASSWORD: Joi.string().allow("").optional(),

    // ── JWT ───────────────────────────────────────────
    JWT_ACCESS_SECRET: Joi.string()
        .required()
        .min(10)
        .description("Secret key for signing access tokens"),
    JWT_ACCESS_EXPIRY: Joi.string().default("15m"),
    JWT_REFRESH_SECRET: Joi.string().optional().default("default-refresh-secret"),
    JWT_REFRESH_EXPIRY: Joi.string().default("7d"),

    // ── Rate Limiting ─────────────────────────────────
    THROTTLE_TTL: Joi.number().default(60000),
    THROTTLE_LIMIT: Joi.number().default(100),

    // ── Logging ───────────────────────────────────────
    LOG_LEVEL: Joi.string().valid("error", "warn", "info", "debug", "verbose").default("info"),

    // ── Clerk Auth ─────────────────────────────────────
    CLERK_PUBLISHABLE_KEY: Joi.string().allow("").optional(),
    CLERK_SECRET_KEY: Joi.string().allow("").optional(),

    // ── Groq AI ───────────────────────────────────────
    GROQ_API_KEY: Joi.string().allow("").optional(),
});
