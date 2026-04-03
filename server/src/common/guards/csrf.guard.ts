import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    // Skip for GET/HEAD/OPTIONS
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      return true;
    }

    // Skip for API endpoints using Bearer token (already authenticated)
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return true;
    }

    // Validate CSRF token
    const csrfToken = request.headers['x-csrf-token'] || 
                      request.body?._csrf || 
                      (request.query as any)?._csrf;

    const cookieToken = request.cookies?.csrfToken;

    if (!csrfToken || !cookieToken || csrfToken !== cookieToken) {
      throw new ForbiddenException('Invalid CSRF token');
    }

    return true;
  }
}
