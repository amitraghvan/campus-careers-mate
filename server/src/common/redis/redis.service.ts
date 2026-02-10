/**
 * Redis Service — managed Redis connection with helper methods.
 */

import { Injectable, OnModuleDestroy, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  public readonly client: Redis;
  private loggedError = false;

  constructor(private readonly config: ConfigService) {
    this.client = new Redis({
      host: this.config.get("REDIS_HOST", "localhost"),
      port: this.config.get<number>("REDIS_PORT", 6379),
      password: this.config.get("REDIS_PASSWORD") || undefined,
      retryStrategy: (times) => {
        if (times > 3) return null as unknown as number; // stop retrying after 3 attempts
        return Math.min(times * 50, 2000);
      },
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    this.client.on("connect", () => this.logger.log("✅ Redis connected"));
    this.client.on("error", (err) => {
      if (!this.loggedError) {
        this.logger.warn(`⚠️  Redis unavailable: ${err.message} — caching disabled`);
        this.loggedError = true;
      }
    });
  }

  onModuleDestroy() {
    this.client.disconnect();
    this.logger.log("🔌 Redis disconnected");
  }

  // ── Cache helpers ──────────────────────────────

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const serialized = typeof value === "string" ? value : JSON.stringify(value);
    if (ttlSeconds) {
      await this.client.setex(key, ttlSeconds, serialized);
    } else {
      await this.client.set(key, serialized);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async delByPattern(pattern: string): Promise<void> {
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }

  async exists(key: string): Promise<boolean> {
    return (await this.client.exists(key)) === 1;
  }

  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }
}

