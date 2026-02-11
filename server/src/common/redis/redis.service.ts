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

  private memoryCache = new Map<string, string>();

  async get<T>(key: string): Promise<T | null> {
    if (this.client.status !== 'ready') {
      const data = this.memoryCache.get(key);
      if (!data) return null;
      try { return JSON.parse(data) as T; } catch { return data as unknown as T; }
    }
    try {
      const data = await this.client.get(key);
      if (!data) return null;
      try {
        return JSON.parse(data) as T;
      } catch {
        return data as unknown as T;
      }
    } catch (e) {
      // Fallback if error occurs during get
      const data = this.memoryCache.get(key);
      if (!data) return null;
      try { return JSON.parse(data) as T; } catch { return data as unknown as T; }
    }
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const serialized = typeof value === "string" ? value : JSON.stringify(value);
    // Always write to memory cache as backup
    this.memoryCache.set(key, serialized);

    if (this.client.status === 'ready') {
      try {
        if (ttlSeconds) {
          await this.client.setex(key, ttlSeconds, serialized);
        } else {
          await this.client.set(key, serialized);
        }
      } catch (e) {
        this.logger.warn(`Redis set failed, using memory: ${(e as Error).message}`);
      }
    }
  }

  async del(key: string): Promise<void> {
    this.memoryCache.delete(key);
    if (this.client.status === 'ready') {
      try {
        await this.client.del(key);
      } catch (e) {
        this.logger.warn(`Redis del failed: ${(e as Error).message}`);
      }
    }
  }

  async delByPattern(pattern: string): Promise<void> {
    // Memory cache pattern match (simple prefix or regex support would be better but keeping it simple)
    if (pattern.endsWith('*')) {
      const prefix = pattern.slice(0, -1);
      for (const key of this.memoryCache.keys()) {
        if (key.startsWith(prefix)) {
          this.memoryCache.delete(key);
        }
      }
    }

    if (this.client.status === 'ready') {
      try {
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
          await this.client.del(...keys);
        }
      } catch (e) {
        this.logger.warn(`Redis delByPattern failed: ${(e as Error).message}`);
      }
    }
  }

  async exists(key: string): Promise<boolean> {
    if (this.memoryCache.has(key)) return true;
    if (this.client.status === 'ready') {
      try {
        return (await this.client.exists(key)) === 1;
      } catch { return false; }
    }
    return false;
  }

  async ttl(key: string): Promise<number> {
    if (this.client.status === 'ready') {
      try {
        return await this.client.ttl(key);
      } catch { return -1; }
    }
    return -1; // memory cache doesn't track TTL for now
  }
}

