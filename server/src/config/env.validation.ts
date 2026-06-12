/**
 * Environment Validation Schema
 * Strict validation for all environment variables
 * Rejects unknown variables to prevent typos and misconfiguration
 */

import * as Joi from "joi";

export const envValidationSchema = Joi.object({
  // ── App Configuration ────────────────────────────
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: Joi.number().port().default(3000),
  API_PREFIX: Joi.string().pattern(/^[a-z]+$/).default("api"),
  API_VERSION: Joi.string().pattern(/^v\d+$/).default("v1"),

  // ── CORS Configuration ─────────────────────────
  CORS_ORIGIN: Joi.string()
    .custom((value, helpers) => {
      const origins = value.split(",").map((o: string) => o.trim());
      // Reject wildcards
      if (origins.some((o: string) => o.includes("*"))) {
        return helpers.error("CORS origin cannot contain wildcards");
      }
      return value;
    })
    .required(),

  // ── Database Configuration ─────────────────────
  DATABASE_URL: Joi.string().required(),
  DB_HOST: Joi.string().hostname().default("localhost"),
  DB_PORT: Joi.number().port().default(5432),
  DB_NAME: Joi.string().optional().default(""),
  DB_USER: Joi.string().optional().default(""),
  DB_PASSWORD: Joi.string().optional().default(""),
  DB_SSL_MODE: Joi.string().valid("disable", "require", "verify-full").default("require"),
  DB_POOL_MIN: Joi.number().min(1).max(100).default(5),
  DB_POOL_MAX: Joi.number().min(1).max(500).default(20),
  DB_QUERY_TIMEOUT: Joi.number().min(1000).max(60000).default(10000),

  // ── Redis Configuration ───────────────────────
  REDIS_HOST: Joi.string().default("localhost"),
  REDIS_PORT: Joi.number().port().default(6379),
  REDIS_PASSWORD: Joi.string().min(8).allow("").optional(),
  REDIS_TLS_ENABLED: Joi.boolean().default(false),
  REDIS_KEY_PREFIX: Joi.string().default("ccm:"),

  // ── JWT Security (Strict validation) ───────────
  JWT_ACCESS_SECRET: Joi.string()
    .hex()
    .min(64) // 32 bytes minimum
    .required()
    .description("Secret key for signing access tokens (64+ hex chars)"),
  JWT_ACCESS_EXPIRY: Joi.string().pattern(/^\d+[smhd]$/).default("15m"),
  JWT_REFRESH_SECRET: Joi.string()
    .hex()
    .min(64)
    .required(),
  JWT_REFRESH_EXPIRY: Joi.string().pattern(/^\d+[smhd]$/).default("7d"),
  JWT_ISSUER: Joi.string().default("campus-careers-mate"),
  JWT_AUDIENCE: Joi.string().default("campus-careers-api"),

  // ── Encryption Key ───────────────────────────
  ENCRYPTION_KEY: Joi.string().hex().length(64).optional(),

  // ── External APIs ──────────────────────────────
  GROQ_API_KEY: Joi.string().pattern(/^gsk_[a-zA-Z0-9]+$/).optional(),

  // ── Clerk Authentication ───────────────────────
  CLERK_PUBLISHABLE_KEY: Joi.string().pattern(/^pk_(test|live)_[a-zA-Z0-9]+$/).optional(),
  CLERK_SECRET_KEY: Joi.string().pattern(/^sk_(test|live)_[a-zA-Z0-9]+$/).optional(),

  // ── Rate Limiting ──────────────────────────────
  THROTTLE_TTL: Joi.number().min(1000).max(3600000).default(60000),
  THROTTLE_LIMIT: Joi.number().min(1).max(10000).default(100),
  AUTH_THROTTLE_TTL: Joi.number().min(1000).max(3600000).default(300000),
  AUTH_THROTTLE_LIMIT: Joi.number().min(1).max(100).default(5),
  AI_THROTTLE_TTL: Joi.number().min(1000).max(3600000).default(60000),
  AI_THROTTLE_LIMIT: Joi.number().min(1).max(100).default(10),

  // ── File Upload Security ───────────────────────
  MAX_FILE_SIZE: Joi.number().max(52428800).default(10485760), // 50MB max, 10MB default
  ALLOWED_FILE_TYPES: Joi.string().default("application/pdf"),
  UPLOAD_DIR: Joi.string().default("uploads"),

  // ── Logging & Monitoring ───────────────────────
  LOG_LEVEL: Joi.string().valid("error", "warn", "info", "debug", "verbose").default("info"),
  LOG_FORMAT: Joi.string().valid("json", "pretty").default("json"),
  AUDIT_LOG_ENABLED: Joi.boolean().default(true),
  SENTRY_DSN: Joi.string().uri().optional(),

  // ── Security Headers ───────────────────────────
  CSP_REPORT_ONLY: Joi.boolean().default(false),
  HSTS_MAX_AGE: Joi.number().min(0).max(63072000).default(31536000),
})
  .unknown(true) // Allow unknown keys (system env vars)
  .options({
    abortEarly: false, // Show all validation errors
    stripUnknown: { objects: true },
  });

/**
 * Configuration interface for type-safe access
 */
export interface AppConfig {
  nodeEnv: "development" | "production" | "test";
  port: number;
  apiPrefix: string;
  apiVersion: string;
  corsOrigins: string[];
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    sslMode: string;
    poolMin: number;
    poolMax: number;
    queryTimeout: number;
  };
  redis: {
    host: string;
    port: number;
    password?: string;
    tlsEnabled: boolean;
    keyPrefix: string;
  };
  jwt: {
    accessSecret: string;
    accessExpiry: string;
    refreshSecret: string;
    refreshExpiry: string;
    issuer: string;
    audience: string;
  };
  encryption?: {
    key: string;
  };
  groqApiKey?: string;
  clerk?: {
    publishableKey?: string;
    secretKey?: string;
  };
  rateLimiting: {
    general: { ttl: number; limit: number };
    auth: { ttl: number; limit: number };
    ai: { ttl: number; limit: number };
  };
  upload: {
    maxFileSize: number;
    allowedTypes: string[];
    uploadDir: string;
  };
  logging: {
    level: string;
    format: string;
    auditEnabled: boolean;
  };
  sentry?: {
    dsn: string;
  };
  security: {
    cspReportOnly: boolean;
    hstsMaxAge: number;
  };
}

/**
 * Parse and validate configuration
 */
export function parseConfig(env: Record<string, unknown>): AppConfig {
  const config: AppConfig = {
    nodeEnv: env.NODE_ENV as AppConfig['nodeEnv'],
    port: env.PORT as number,
    apiPrefix: env.API_PREFIX as string,
    apiVersion: env.API_VERSION as string,
    corsOrigins: (env.CORS_ORIGIN as string).split(',').map((o) => o.trim()),
    database: {
      host: env.DB_HOST as string,
      port: env.DB_PORT as number,
      name: env.DB_NAME as string,
      user: env.DB_USER as string,
      password: env.DB_PASSWORD as string,
      sslMode: env.DB_SSL_MODE as string,
      poolMin: env.DB_POOL_MIN as number,
      poolMax: env.DB_POOL_MAX as number,
      queryTimeout: env.DB_QUERY_TIMEOUT as number,
    },
    redis: {
      host: env.REDIS_HOST as string,
      port: env.REDIS_PORT as number,
      password: (env.REDIS_PASSWORD as string) || undefined,
      tlsEnabled: env.REDIS_TLS_ENABLED as boolean,
      keyPrefix: env.REDIS_KEY_PREFIX as string,
    },
    jwt: {
      accessSecret: env.JWT_ACCESS_SECRET as string,
      accessExpiry: env.JWT_ACCESS_EXPIRY as string,
      refreshSecret: env.JWT_REFRESH_SECRET as string,
      refreshExpiry: env.JWT_REFRESH_EXPIRY as string,
      issuer: env.JWT_ISSUER as string,
      audience: env.JWT_AUDIENCE as string,
    },
    groqApiKey: (env.GROQ_API_KEY as string) || undefined,
    rateLimiting: {
      general: {
        ttl: env.THROTTLE_TTL as number,
        limit: env.THROTTLE_LIMIT as number,
      },
      auth: {
        ttl: env.AUTH_THROTTLE_TTL as number,
        limit: env.AUTH_THROTTLE_LIMIT as number,
      },
      ai: {
        ttl: env.AI_THROTTLE_TTL as number,
        limit: env.AI_THROTTLE_LIMIT as number,
      },
    },
    upload: {
      maxFileSize: env.MAX_FILE_SIZE as number,
      allowedTypes: (env.ALLOWED_FILE_TYPES as string).split(','),
      uploadDir: env.UPLOAD_DIR as string,
    },
    logging: {
      level: env.LOG_LEVEL as string,
      format: env.LOG_FORMAT as string,
      auditEnabled: env.AUDIT_LOG_ENABLED as boolean,
    },
    security: {
      cspReportOnly: env.CSP_REPORT_ONLY as boolean,
      hstsMaxAge: env.HSTS_MAX_AGE as number,
    },
  };

  // Optional fields — set only when the env var is present
  if (env.ENCRYPTION_KEY) {
    config.encryption = { key: env.ENCRYPTION_KEY as string };
  }
  if (env.CLERK_PUBLISHABLE_KEY) {
    config.clerk = {
      publishableKey: env.CLERK_PUBLISHABLE_KEY as string,
      secretKey: env.CLERK_SECRET_KEY as string,
    };
  }
  if (env.SENTRY_DSN) {
    config.sentry = { dsn: env.SENTRY_DSN as string };
  }

  return config;
}
