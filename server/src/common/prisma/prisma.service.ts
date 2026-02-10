/**
 * Prisma Service — managed database connection lifecycle.
 * Uses @neondatabase/serverless + @prisma/adapter-neon for Neon PostgreSQL.
 */

import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

// Required for Node.js environments (Neon serverless uses WebSockets)
neonConfig.webSocketConstructor = ws;

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const connectionString = process.env.DATABASE_URL!;
    const adapter = new PrismaNeon({ connectionString });

    super({ adapter });
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

