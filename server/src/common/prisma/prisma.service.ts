/**
 * Prisma Service — managed database connection lifecycle.
 * Uses @neondatabase/serverless + @prisma/adapter-neon for Neon PostgreSQL.
 * Falls back to pg adapter for local development.
 */

import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger;

  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      console.error(
        '❌ DATABASE_URL environment variable is not set! ' +
        'Please set it in your environment (Render Dashboard → Environment tab).'
      );
      super();
      this.logger = new Logger(PrismaService.name);
      return;
    }

    // Prisma 7: Use Adapter for dynamic connection configuration
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    super({
      adapter,
    });

    this.logger = new Logger(PrismaService.name);
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log("✅ Database connected");
    } catch (error) {
      this.logger.error("❌ Database connection failed", error);
      throw error;
    }
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

