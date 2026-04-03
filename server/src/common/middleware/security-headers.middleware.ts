import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Sets additional security headers not covered by Helmet.
 */
@Injectable()
export class SecurityHeadersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Prevent MIME-type sniffing (belt-and-suspenders alongside helmet's noSniff)
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // Prevent clickjacking (belt-and-suspenders alongside helmet's frameguard)
    res.setHeader('X-Frame-Options', 'DENY');
    // Remove server fingerprint header
    res.removeHeader('X-Powered-By');
    // Permissions Policy — disable sensitive browser APIs
    res.setHeader(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), payment=()',
    );
    next();
  }
}
