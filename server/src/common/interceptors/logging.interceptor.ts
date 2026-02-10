/**
 * Logging Interceptor
 * Logs every request with method, path, duration, and status.
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Request, Response } from "express";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HTTP");

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();
    const { method, originalUrl, ip } = req;
    const userAgent = req.get("user-agent") || "";
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse<Response>();
        const duration = Date.now() - now;
        this.logger.log(
          `${method} ${originalUrl} ${res.statusCode} ${duration}ms — ${ip} ${userAgent}`,
        );
      }),
    );
  }
}
