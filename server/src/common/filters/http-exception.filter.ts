/**
 * Global HTTP Exception Filter
 * Catches all exceptions and returns a consistent error response.
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

interface ErrorResponse {
  success: false;
  error: {
    code: number;
    message: string;
    details?: string;
  };
  timestamp: string;
  path: string;
  requestId?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    let error = "Internal Server Error";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === "string") {
        message = res;
      } else if (typeof res === "object" && res !== null) {
        const resObj = res as Record<string, unknown>;
        message = (resObj.message as string) || message;
        error = (resObj.error as string) || error;

        // Handle validation errors (array of messages)
        if (Array.isArray(resObj.message)) {
          message = (resObj.message as string[]).join("; ");
        }
      }
    } else if (exception instanceof Error) {
      // Log the full error server-side for debugging
      this.logger.error(
        `Unhandled exception: ${exception.message}`,
        exception.stack,
      );

      // Detect Prisma errors and return user-friendly messages
      const errorName = exception.constructor?.name || '';
      if (errorName.includes('PrismaClient')) {
        // PrismaClientKnownRequestError, PrismaClientInitializationError,
        // PrismaClientValidationError, PrismaClientUnknownRequestError
        if (errorName === 'PrismaClientInitializationError') {
          status = HttpStatus.SERVICE_UNAVAILABLE;
          message = 'Database connection failed. Please try again later.';
          error = 'Service Unavailable';
        } else if (errorName === 'PrismaClientKnownRequestError') {
          status = HttpStatus.BAD_REQUEST;
          const ex = exception as { code?: string; meta?: unknown };
          const prismaCode = ex.code || 'unknown';
          const metaInfo = ex.meta ? JSON.stringify(ex.meta) : '';
          this.logger.error(`PrismaClientKnownRequestError [${prismaCode}]: ${(exception as Error).message} ${metaInfo}`);
          message = `A database error occurred (code: ${prismaCode}). Please check your request.`;
          error = 'Bad Request';
        } else {
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          message = 'An unexpected database error occurred. Please try again later.';
          error = 'Internal Server Error';
        }
      } else {
        // For any other unhandled errors, return a generic message
        // NEVER leak raw error messages to the client
        message = 'An unexpected error occurred. Please try again later.';
      }
    } else {
      // Non-Error exceptions (strings, objects, etc.)
      this.logger.error(`Unhandled non-Error exception: ${JSON.stringify(exception)}`);
      message = 'An unexpected error occurred. Please try again later.';
    }

    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: status,
        message,
        details: error !== message ? error : undefined,
      },
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId: request.headers["x-request-id"] as string,
    };

    response.status(status).json(errorResponse);
  }
}

