/**
 * Prisma Service — managed database connection lifecycle.
 * Uses @neondatabase/serverless + @prisma/adapter-neon for Neon PostgreSQL.
 * Falls back to pg adapter for local development.
 */

import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { neonConfig, Pool as NeonPool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool as PgPool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import ws from "ws";

// Required for Node.js environments (Neon serverless uses WebSockets)
neonConfig.webSocketConstructor = ws;

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger;

  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      // Log a clear error and use a dummy connection that will fail gracefully
      console.error(
        '❌ DATABASE_URL environment variable is not set! ' +
        'Please set it in your environment (Render Dashboard → Environment tab).'
      );
      super();
      this.logger = new Logger(PrismaService.name);
      return;
    }

    const isLocal = connectionString.includes("localhost") || connectionString.includes("127.0.0.1");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let options: any = {};

    if (!isLocal) {
      const pool = new NeonPool({ connectionString });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const adapter = new PrismaNeon(pool as any);
      options = { adapter };
    } else {
      const pool = new PgPool({ connectionString });
      const adapter = new PrismaPg(pool);
      options = { adapter };
    }

    super(options);
    this.logger = new Logger(PrismaService.name);
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log("✅ Database connected (Neon serverless adapter)");
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log("🔌 Database disconnected");
  }

  /**
   * Execute operations in a transaction with retry logic.
   */
  async executeInTransaction<T>(
    fn: (tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">) => Promise<T>,
    maxRetries = 3,
  ): Promise<T> {
    let retries = 0;
    while (retries < maxRetries) {
      try {
        return await this.$transaction(fn, {
          maxWait: 5000,
          timeout: 10000,
        });
      } catch (error) {
        retries++;
        if (retries >= maxRetries) throw error;
        this.logger.warn(
          `Transaction retry ${retries}/${maxRetries}: ${(error as Error).message}`,
        );
        await new Promise((resolve) => setTimeout(resolve, 100 * retries));
      }
    }
    throw new Error("Transaction failed after max retries");
  }
}

