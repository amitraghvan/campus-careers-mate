/**
 * ╔══════════════════════════════════════════════════╗
 * ║        Application Entry Point                   ║
 * ║  Bootstrap NestJS with all production configs    ║
 * ╚══════════════════════════════════════════════════╝
 */

import { NestFactory } from "@nestjs/core";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";
import * as compression from "compression";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { WinstonLogger } from "./common/logger/winston.logger";

async function bootstrap() {
  const logger = new WinstonLogger();

  const app = await NestFactory.create(AppModule, {
    logger,
    bufferLogs: true,
  });

  const config = app.get(ConfigService);
  const port = config.get<number>("PORT", 3000);
  const prefix = config.get<string>("API_PREFIX", "api/v1");
  const corsOrigin = config.get<string>("CORS_ORIGIN", "http://localhost:8080");

  // ── Security ────────────────────────────────────
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  // ── CORS ────────────────────────────────────────
  const allowedOrigins = corsOrigin
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      // Allow if origin is in the allowed list or is a Vercel preview deploy
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
  });

  // ── Global Prefix & Versioning ──────────────────
  app.setGlobalPrefix(prefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });

  // ── Global Pipes ────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── Global Filters & Interceptors ───────────────
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // ── Swagger (dev only) ──────────────────────────
  if (config.get("NODE_ENV") !== "production") {
    const swaggerConfig = new DocumentBuilder()
      .setTitle("PlaceTrack API")
      .setDescription("Smart Placement Tracker — REST API Documentation")
      .setVersion("1.0")
      .addBearerAuth()
      .addTag("auth", "Authentication & Authorization")
      .addTag("users", "User Management")
      .addTag("opportunities", "Placement Opportunities")
      .addTag("dashboard", "Dashboard & Analytics")
      .addTag("notes", "Preparation Notes")
      .addTag("health", "Health Checks")
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("docs", app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    logger.log(`📚 Swagger docs: http://localhost:${port}/docs`, "Bootstrap");
  }

  // ── Start ───────────────────────────────────────
  await app.listen(port);
  logger.log(
    `🚀 PlaceTrack API running on http://localhost:${port}/${prefix}`,
    "Bootstrap",
  );
  logger.log(`📋 Environment: ${config.get("NODE_ENV")}`, "Bootstrap");
}

bootstrap();

