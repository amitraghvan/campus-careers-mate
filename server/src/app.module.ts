/**
 * Root Application Module
 * Orchestrates all feature modules and global providers.
 */

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { ScheduleModule } from "@nestjs/schedule";
import { APP_GUARD } from "@nestjs/core";

// Core
import { PrismaModule } from "./common/prisma/prisma.module";
import { RedisModule } from "./common/redis/redis.module";
import { HealthModule } from "./common/health/health.module";

// Feature modules
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { OpportunitiesModule } from "./modules/opportunities/opportunities.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { NotesModule } from "./modules/notes/notes.module";
import { PeerModule } from './modules/peer/peer.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    // ── Config ────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    // ── Rate Limiting ─────────────────────────────
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>("THROTTLE_TTL", 60000),
          limit: config.get<number>("THROTTLE_LIMIT", 100),
        },
      ],
    }),

    // ── Scheduled Tasks ───────────────────────────
    ScheduleModule.forRoot(),

    // ── Core ──────────────────────────────────────
    PrismaModule,
    RedisModule,
    HealthModule,

    // ── Feature Modules ───────────────────────────
    AuthModule,
    UsersModule,
    OpportunitiesModule,
    DashboardModule,
    NotesModule,
    PeerModule,
    ChatModule,
  ],
  providers: [
    // Global rate-limit guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }

