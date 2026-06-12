/**
 * ╔══════════════════════════════════════════════════╗
 * ║        Application Entry Point                   ║
 * ║  Bootstrap NestJS with enterprise-grade security   ║
 * ╚══════════════════════════════════════════════════╝
 */

import { NestFactory } from "@nestjs/core";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";
import * as compression from "compression";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import { join } from "path";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { WinstonLogger } from "./common/logger/winston.logger";
import { SecurityHeadersMiddleware } from "./common/middleware/security-headers.middleware";
import { csrfTokenMiddleware } from "./common/middleware/csrf.middleware";
import { AppConfig } from "./config/env.validation";

async function bootstrap() {
  const logger = new WinstonLogger();

  const app = await NestFactory.create(AppModule, {
    logger,
    bufferLogs: true,
    bodyParser: false, // Disable default, configure below
  });

  const config = app.get(ConfigService);
  const appConfig = config.get<AppConfig>("app");

  const port = config.get<number>("PORT", 3000);
  const prefix = config.get<string>("API_PREFIX", "api");
  const corsOrigins = config.get<string[]>("app.corsOrigins", ["http://localhost:5173"]);
  const isDevelopment = config.get<string>("NODE_ENV") === "development";
  const isProduction = config.get<string>("NODE_ENV") === "production";

  // ── Security: Body Parser Limits ─────────────────
  app.use(express.json({
    limit: "10kb",
    strict: true, // Only accept objects/arrays
  }));
  app.use(express.urlencoded({
    extended: true,
    limit: "10kb",
  }));

  // ── Security: Helmet Configuration ─────────────────
  app.use(
    helmet({
      contentSecurityPolicy: isProduction ? {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"], // Required for some React patterns
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "https://api.groq.com"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      } : false,
      hsts: isProduction ? {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      } : false,
      frameguard: {
        action: "deny",
      },
      crossOriginEmbedderPolicy: false, // Required for PDF compatibility
      crossOriginResourcePolicy: {
        policy: "cross-origin",
      },
      dnsPrefetchControl: {
        allow: false,
      },
      referrerPolicy: {
        policy: "strict-origin-when-cross-origin",
      },
      hidePoweredBy: true,
      ieNoOpen: true,
      noSniff: true,
      originAgentCluster: true,
      permittedCrossDomainPolicies: {
        permittedPolicies: "none",
      },
      xssFilter: true,
    })
  );

  // ── Security: Custom Security Headers ──────────────
  app.use(new SecurityHeadersMiddleware().use);

  // ── Security: Compression (after security headers) ─
  app.use(compression());

  // ── Security: Cookie Parser with Secrets ───────────
  const cookieSecret = config.get<string>("COOKIE_SECRET");
  if (cookieSecret) {
    app.use(cookieParser(cookieSecret));
  } else {
    app.use(cookieParser());
  }

  // ── Security: Global CSRF Middleware ───────────────
  app.use(csrfTokenMiddleware);

  // ── Security: Static File Serving (uploads) ─────────
  // Note: In production, use S3/CloudFront instead
  app.use("/uploads",
    (req: any, res: any, next: any) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("X-Frame-Options", "DENY");
      res.setHeader("Content-Security-Policy", "default-src 'none'; sandbox");
      res.setHeader("Cache-Control", "private, max-age=3600");
      next();
    },
    express.static(join(process.cwd(), "uploads"), {
      maxAge: "1d",
      etag: true,
      immutable: true,
      index: false,
      fallthrough: false,
    })
  );

  // ── Security: CORS (Strict whitelist) ─────────────
  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Reject request with no origin in production
      if (!origin) {
        if (isProduction) {
          return callback(new Error("Origin required"), false);
        }
        return callback(null, true);
      }

      // Check if origin is in whitelist
      const isAllowed = corsOrigins.some((allowed) => {
        // Exact match
        if (allowed === origin) return true;
        // Allow exact subdomain matches in production if configured
        if (isProduction && origin.endsWith(".campuscareersmate.com")) return true;
        // Allow localhost in development
        if (isDevelopment && origin.match(/^http:\/\/localhost:\d+$/)) return true;
        return false;
      });

      if (isAllowed) {
        return callback(null, true);
      }

      logger.warn(`Blocked CORS request from origin: ${origin}`, "CORS");
      callback(new Error("Origin not allowed"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Request-Id",
      "X-Correlation-Id",
    ],
    exposedHeaders: ["X-Request-Id"],
    maxAge: 86400, // 24 hours
    preflightContinue: false,
  });

  // ── API Versioning & Prefix ────────────────────────
  app.setGlobalPrefix(prefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: config.get<string>("API_VERSION", "v1").replace("v", ""),
  });

  // ── Global Pipes (Validation) ──────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true, // Throw error on unknown properties
      transform: true,
      transformOptions: {
        enableImplicitConversion: false, // Be explicit about types
      },
      disableErrorMessages: isProduction, // Don't leak validation details
    }),
  );

  // ── Global Filters & Interceptors ──────────────────
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // ── Swagger (Development Only with Auth) ───────────
  if (isDevelopment) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle("Campus Careers Mate API")
      .setDescription("Smart Placement Tracker — REST API Documentation")
      .setVersion("1.0")
      .addBearerAuth(
        {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT Bearer token from Clerk",
        },
        "JWT"
      )
      .addSecurityRequirements("JWT")
      .addTag("auth", "Authentication & Authorization")
      .addTag("users", "User Management")
      .addTag("opportunities", "Placement Opportunities")
      .addTag("dashboard", "Dashboard & Analytics")
      .addTag("ai", "AI Features (Rate Limited)")
      .addTag("documents", "Document Management")
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);

    // Add security warning to swagger
    document.info.description += "\n\n⚠️ **Security Notice:** AI endpoints are rate-limited to 10 requests/minute.";

    SwaggerModule.setup("docs", app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tryItOutEnabled: false, // Disable execute in production
      },
      customCss: ".swagger-ui .topbar { display: none }", // Hide swagger branding
    });

    logger.log(`📚 Swagger docs: http://localhost:${port}/docs`, "Bootstrap");
  }

  // ── Graceful Shutdown ──────────────────────────────
  app.enableShutdownHooks();

  // ── Start Server ──────────────────────────────────
  await app.listen(port);

  logger.log(
    `🚀 Campus Careers API running on http://localhost:${port}/${prefix}/v1`,
    "Bootstrap",
  );
  logger.log(`📋 Environment: ${config.get("NODE_ENV")}`, "Bootstrap");
  logger.log(`🔒 Security headers: ${isProduction ? "enabled" : "development mode"}`, "Bootstrap");
}

// Global error handling for uncaught exceptions
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

bootstrap();
