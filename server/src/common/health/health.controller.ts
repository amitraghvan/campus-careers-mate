/**
 * Health Check Controller
 * Provides /health endpoint for monitoring.
 */

import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { PrismaService } from "../prisma/prisma.service";
import { RedisService } from "../redis/redis.service";

@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  @Get()
  @ApiOperation({ summary: "Application health check" })
  async check() {
    const checks: Record<string, string> = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: `${process.uptime().toFixed(0)}s`,
    };

    // Database check
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      checks.database = "connected";
    } catch {
      checks.database = "disconnected";
      checks.status = "degraded";
    }

    // Redis check
    try {
      await this.redis.client.ping();
      checks.redis = "connected";
    } catch {
      checks.redis = "disconnected";
      checks.status = "degraded";
    }

    return checks;
  }
}
