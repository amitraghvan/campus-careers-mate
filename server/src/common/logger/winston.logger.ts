/**
 * Winston Logger — structured JSON logging for production.
 */

import { LoggerService } from "@nestjs/common";
import * as winston from "winston";

const winstonInstance = winston.createLogger({
  level: process.env.LOG_LEVEL || "debug",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    winston.format.errors({ stack: true }),
    process.env.NODE_ENV === "production"
      ? winston.format.json()
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, context, stack }) => {
            const ctx = context ? ` [${context}]` : "";
            const stk = stack ? `\n${stack}` : "";
            return `${timestamp} ${level}${ctx}: ${message}${stk}`;
          }),
        ),
  ),
  transports: [new winston.transports.Console()],
});

export class WinstonLogger implements LoggerService {
  log(message: string, context?: string) {
    winstonInstance.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    winstonInstance.error(message, { context, stack: trace });
  }

  warn(message: string, context?: string) {
    winstonInstance.warn(message, { context });
  }

  debug(message: string, context?: string) {
    winstonInstance.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    winstonInstance.verbose(message, { context });
  }
}
