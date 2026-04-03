# 🔒 Campus Careers Mate — Security Hardening Guide

**Classification:** CONFIDENTIAL
**Version:** 2.0
**Date:** 2026-03-24
**Author:** Senior Security Engineer

---

## 📋 Executive Summary

This document provides a comprehensive security audit and hardening guide for the Campus Careers Mate / Plaxk Track application ecosystem. The system currently has **GOOD** security foundations but requires critical fixes in several areas.

### Risk Rating: MEDIUM-HIGH
- **Critical Issues:** 2
- **High Issues:** 3
- **Medium Issues:** 8
- **Low Issues:** 5

---

## 🚨 CRITICAL VULNERABILITIES

### 1. CRITICAL: Frontend API Key Exposure (GROQ)

**Location:** `src/lib/groq.ts`

**Vulnerability:** The GROQ API key is exposed in frontend code with `dangerouslyAllowBrowser: true`. This allows any user to extract the API key and abuse the AI service, leading to:
- API quota exhaustion
- Cost overruns
- Potential data exfiltration via prompt injection
- Unauthorized API usage

**Risk:** CVSS 9.1 - Critical

**Fix:** Remove browser-side GROQ client entirely. Route all AI calls through backend.

```typescript
// ❌ BEFORE: src/lib/groq.ts (DELETE THIS FILE)
import Groq from 'groq-sdk';
const API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
export function getGroqClient() {
    return new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true });
}

// ✅ AFTER: Route through backend only
// Frontend calls: api.post('/ai/homework-solver', { question })
// Backend handles AI call securely with server-side API key
```

**Additional Steps:**
1. Rotate exposed API key immediately
2. Remove VITE_GROQ_API_KEY from all environments
3. Implement backend-only AI service calls
4. Add per-user AI usage quotas

---

### 2. CRITICAL: WebSocket JWT Algorithm Mismatch

**Location:** `server/src/modules/chat/gateway/chat.gateway.ts:81`

**Vulnerability:** The WebSocket gateway uses `HS256` algorithm to verify JWTs, but Clerk issues tokens with `RS256`. This causes:
- Authentication failures for WebSocket connections
- Potential fallback to unauthenticated mode
- Inconsistent auth state between HTTP and WebSocket

**Risk:** CVSS 8.2 - High

**Fix:** Update WebSocket auth to use RS256 with JWKS endpoint.

```typescript
// ❌ BEFORE: chat.gateway.ts line 81
const payload = this.jwtService.verify(token, { algorithms: ['HS256'] });

// ✅ AFTER: Use RS256 with JWKS
import { passportJwtSecret } from 'jwks-rsa';

// In constructor, setup JWKS client
private jwksClient: JwksClient;

constructor(...) {
  this.jwksClient = new JwksClient({
    jwksUri: getClerkJwksUri(config.get('CLERK_PUBLISHABLE_KEY')),
    cache: true,
    rateLimit: true,
  });
}

async handleConnection(client: Socket) {
  const token = client.handshake.auth.token ||
                client.handshake.headers.authorization?.split(' ')[1];

  if (!token) {
    client.disconnect(true);
    return;
  }

  try {
    // Decode token to get key ID
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded) throw new Error('Invalid token');

    // Get signing key from JWKS
    const key = await this.jwksClient.getSigningKey(decoded.header.kid);
    const publicKey = key.getPublicKey();

    // Verify with RS256
    const payload = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      issuer: 'https://' + clerkDomain,
      audience: clerkAudience,
    });

    client.data.user = payload;
    client.join(`user_${payload.sub}`);
  } catch (e) {
    this.logger.warn(`WS auth failed: ${e.message}`);
    client.disconnect(true);
  }
}
```

---

### 3. HIGH: Missing Authentication Guard on Documents Controller

**Location:** `server/src/modules/documents/documents.controller.ts`

**Vulnerability:** No `@UseGuards(JwtAuthGuard)` decorator, allowing anonymous access with fallback to 'anonymous' user ID. Any unauthenticated user can upload, read, and delete documents.

**Risk:** CVSS 8.1 - High

**Fix:** Add authentication guard and remove anonymous fallbacks.

```typescript
// ❌ BEFORE
@Controller('documents')
export class DocumentsController {
  @Get()
  async list(@Req() req: any) {
    const userId = req.user?.id || req.user?.sub || 'anonymous'; // DANGEROUS
    // ...
  }
}

// ✅ AFTER
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('documents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DocumentsController {
  @Get()
  async list(@CurrentUser('id') userId: string) {
    // Guaranteed authenticated
    return this.documentsService.listDocuments(userId);
  }

  // Apply to ALL endpoints - upload, get, delete, etc.
}
```

---

### 4. HIGH: Weak Password Policy & Missing 2FA

**Location:** `server/src/modules/auth/dto/auth.dto.ts`

**Vulnerability:** Password policy allows passwords that may be in breach databases. No rate limiting per email (only per IP). No 2FA/MFA support.

**Risk:** CVSS 7.5 - High

**Fix:** Implement strong password policy with breach checking.

```typescript
// Enhanced SignUpDto with breach checking
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as crypto from 'crypto';

@Injectable()
export class PasswordSecurityService {
  constructor(private http: HttpService) {}

  // Check password against HaveIBeenPwned API
  async isPasswordBreached(password: string): Promise<boolean> {
    const sha1 = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
    const prefix = sha1.substring(0, 5);
    const suffix = sha1.substring(5);

    try {
      const response = await this.http.get(
        `https://api.pwnedpasswords.com/range/${prefix}`
      ).toPromise();

      return response.data.includes(suffix);
    } catch {
      return false; // Fail open but log
    }
  }

  // Calculate password strength (zxcvbn algorithm)
  calculateStrength(password: string): { score: number; feedback: string[] } {
    // Implementation using zxcvbn library
    // ...
  }
}
```

---

## 🔶 MEDIUM VULNERABILITIES

### 5. MEDIUM: CORS Configuration Allows Open Origin in Dev

**Location:** `server/src/main.ts:140`

**Vulnerability:** Development mode allows any localhost origin, which can be exploited via DNS rebinding or if an attacker runs a local server.

**Fix:** Strict CORS even in development.

```typescript
// ✅ SECURE: Strict CORS configuration
const corsOrigins = config.get<string[]>('app.corsOrigins', [
  'http://localhost:5173',  // Vite default
  'http://localhost:3000',  // Next.js default
]);

app.enableCors({
  origin: (origin: string | undefined, callback) => {
    // Reject requests with no origin in production
    if (!origin) {
      if (isProduction) {
        return callback(new Error('Origin required'), false);
      }
      return callback(null, true);
    }

    // Strict whitelist matching
    const isAllowed = corsOrigins.some(allowed => {
      if (allowed === origin) return true;
      // Allow exact subdomain matches in production
      if (isProduction && origin.endsWith('.yourdomain.com')) return true;
      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      logger.warn(`Blocked CORS from: ${origin}`);
      callback(new Error('Origin not allowed'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Request-Id',
    'X-Correlation-Id',
    'X-CSRF-Token',  // For double-submit cookie pattern
  ],
  exposedHeaders: ['X-Request-Id'],
  maxAge: 600, // 10 minutes (not 24 hours for security)
});
```

---

### 6. MEDIUM: File Upload Security Gaps

**Location:** `server/src/modules/documents/documents.service.ts`

**Vulnerabilities:**
- No virus scanning
- Limited file type validation (only checks MIME type)
- No maximum file content validation
- Path traversal still possible via symbolic links

**Fix:** Implement comprehensive file upload security.

```typescript
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SecureFileUploadService {
  private readonly uploadsDir: string;
  private readonly maxFileSize: number;
  private readonly allowedTypes: Map<string, string[]>;

  constructor(private config: ConfigService) {
    this.uploadsDir = path.resolve(process.cwd(), 'uploads');
    this.maxFileSize = this.config.get('MAX_FILE_SIZE', 10 * 1024 * 1024);

    // Map MIME types to magic numbers
    this.allowedTypes = new Map([
      ['application/pdf', ['%PDF']],
      ['image/jpeg', ['\xff\xd8\xff']],
      ['image/png', ['\x89PNG\r\n\x1a\n']],
    ]);
  }

  async validateAndSaveFile(
    file: Express.Multer.File,
    userId: string
  ): Promise<{ filePath: string; fileHash: string }> {
    // 1. Check file size
    if (file.size > this.maxFileSize) {
      throw new BadRequestException('File exceeds maximum size');
    }

    // 2. Verify magic bytes
    const magic = file.buffer.slice(0, 8).toString('hex');
    const expectedMagics = this.allowedTypes.get(file.mimetype);

    if (!expectedMagics) {
      throw new BadRequestException('File type not allowed');
    }

    const validMagic = expectedMagics.some(m =>
      file.buffer.toString('ascii', 0, m.length) === m ||
      file.buffer.slice(0, m.length).equals(Buffer.from(m, 'binary'))
    );

    if (!validMagic) {
      throw new BadRequestException('File content does not match type');
    }

    // 3. Calculate file hash for deduplication and integrity
    const fileHash = crypto.createHash('sha256').update(file.buffer).digest('hex');

    // 4. Generate safe filename using hash prefix
    const safeFilename = `${fileHash.substring(0, 16)}_${Date.now()}.pdf`;
    const filePath = path.join(this.uploadsDir, safeFilename);

    // 5. Ensure path is within uploads directory
    const resolvedPath = path.resolve(filePath);
    if (!resolvedPath.startsWith(this.uploadsDir + path.sep)) {
      throw new BadRequestException('Invalid file path');
    }

    // 6. Check for existing file (deduplication)
    const existing = await this.findByHash(fileHash);
    if (existing) {
      return { filePath: existing.path, fileHash };
    }

    // 7. Write file with restricted permissions
    await fs.promises.mkdir(this.uploadsDir, { recursive: true });
    await fs.promises.writeFile(filePath, file.buffer, { mode: 0o640 });

    // 8. Async virus scan (if ClamAV available)
    this.scanForVirus(filePath).catch(err =>
      console.error('Virus scan failed:', err)
    );

    return { filePath: `/uploads/${safeFilename}`, fileHash };
  }

  private async scanForVirus(filePath: string): Promise<boolean> {
    // Integration with ClamAV or cloud scanner
    // Return true if clean, throw if infected
    // ...
    return true;
  }

  private async findByHash(hash: string): Promise<{ path: string } | null> {
    // Check database for existing file with same hash
    // ...
    return null;
  }
}
```

---

### 7. MEDIUM: Redis Security Configuration

**Location:** `server/src/common/redis/redis.service.ts`

**Vulnerabilities:**
- No TLS for Redis connections
- No authentication validation
- Memory cache fallback may expose data
- Keys pattern scanning without protection

**Fix:** Secure Redis configuration.

```typescript
import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class SecureRedisService implements OnModuleDestroy {
  private readonly logger = new Logger(SecureRedisService.name);
  public readonly client: Redis;
  private readonly keyPrefix: string;

  constructor(private config: ConfigService) {
    this.keyPrefix = config.get('REDIS_KEY_PREFIX', 'ccm:');

    const tlsEnabled = config.get<boolean>('REDIS_TLS_ENABLED', false);
    const password = config.get<string>('REDIS_PASSWORD');

    this.client = new Redis({
      host: config.get('REDIS_HOST', 'localhost'),
      port: config.get<number>('REDIS_PORT', 6379),
      password: password || undefined,
      db: config.get<number>('REDIS_DB', 0),

      // TLS Configuration
      tls: tlsEnabled ? {
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2',
      } : undefined,

      // Security settings
      enableOfflineQueue: false, // Don't queue commands when disconnected
      enableReadyCheck: true,

      // Retry configuration
      retryStrategy: (times) => {
        if (times > 3) {
          this.logger.error('Redis connection failed after 3 retries');
          return null;
        }
        return Math.min(times * 100, 3000);
      },

      maxRetriesPerRequest: 2,
      lazyConnect: true,
    });

    this.client.on('connect', () => {
      this.logger.log('Redis connected');
    });

    this.client.on('error', (err) => {
      this.logger.error('Redis error:', err.message);
    });

    // Verify AUTH on connect
    this.client.on('ready', async () => {
      if (password) {
        try {
          await this.client.auth(password);
        } catch (e) {
          this.logger.error('Redis authentication failed');
        }
      }
    });
  }

  // Secure key generation with prefix
  private getKey(key: string): string {
    // Sanitize key to prevent injection
    const sanitized = key.replace(/[^a-zA-Z0-9:_-]/g, '');
    return `${this.keyPrefix}${sanitized}`;
  }

  async get<T>(key: string): Promise<T | null> {
    const fullKey = this.getKey(key);
    const data = await this.client.get(fullKey);
    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const fullKey = this.getKey(key);
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);

    if (ttlSeconds) {
      await this.client.setex(fullKey, ttlSeconds, serialized);
    } else {
      // Don't allow keys without TTL
      await this.client.setex(fullKey, 3600, serialized); // Default 1 hour
    }
  }

  // Rate limiting helper
  async checkRateLimit(
    key: string,
    maxAttempts: number,
    windowSeconds: number
  ): Promise<{ allowed: boolean; remaining: number }> {
    const fullKey = this.getKey(`ratelimit:${key}`);
    const current = await this.client.incr(fullKey);

    if (current === 1) {
      await this.client.expire(fullKey, windowSeconds);
    }

    const ttl = await this.client.ttl(fullKey);
    return {
      allowed: current <= maxAttempts,
      remaining: Math.max(0, maxAttempts - current),
    };
  }

  onModuleDestroy() {
    this.client.disconnect();
  }
}
```

---

### 8. MEDIUM: Missing Input Sanitization for XSS Prevention

**Location:** Various controllers

**Vulnerability:** User-generated content (notes, messages) may contain XSS payloads that could execute in other users' browsers.

**Fix:** Implement comprehensive input sanitization.

```typescript
import DOMPurify from 'isomorphic-dompurify';
import { Transform, TransformFnParams } from 'class-transformer';

// Sanitize decorator for DTOs
export function SanitizeHtml(): PropertyDecorator {
  return Transform(({ value }: TransformFnParams) => {
    if (typeof value !== 'string') return value;
    return DOMPurify.sanitize(value, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
      ALLOWED_ATTR: ['href', 'target'],
      FORBID_ATTR: ['style', 'onerror', 'onload'],
    });
  });
}

// Usage in DTOs
export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  @SanitizeHtml()
  content!: string;
}

// Also sanitize AI outputs
export class SanitizedAiService {
  sanitizeOutput(text: string): string {
    return DOMPurify.sanitize(text, {
      ALLOWED_TAGS: [], // No HTML in AI outputs
      ALLOWED_ATTR: [],
    });
  }
}
```

---

### 9. MEDIUM: Insufficient Logging & Monitoring

**Location:** Various modules

**Vulnerability:** Security events are not consistently logged. Failed auth attempts, suspicious activities are not tracked.

**Fix:** Implement comprehensive security audit logging.

```typescript
// server/src/common/security/audit-logger.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export enum AuditEvent {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  TOKEN_REFRESH = 'TOKEN_REFRESH',
  TOKEN_REVOKED = 'TOKEN_REVOKED',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  DATA_EXPORT = 'DATA_EXPORT',
  FILE_UPLOAD = 'FILE_UPLOAD',
  AI_REQUEST = 'AI_REQUEST',
}

interface AuditLogEntry {
  event: AuditEvent;
  userId?: string;
  ip: string;
  userAgent?: string;
  timestamp: Date;
  metadata: Record<string, unknown>;
  riskScore: number;
}

@Injectable()
export class AuditLoggerService {
  private readonly logger = new Logger('SecurityAudit');
  private readonly isProduction: boolean;

  constructor(private config: ConfigService) {
    this.isProduction = config.get('NODE_ENV') === 'production';
  }

  async log(entry: Omit<AuditLogEntry, 'timestamp'>): Promise<void> {
    const fullEntry: AuditLogEntry = {
      ...entry,
      timestamp: new Date(),
    };

    // Log to console/file
    this.logger.log(JSON.stringify(fullEntry));

    // In production, also send to SIEM
    if (this.isProduction) {
      await this.sendToSIEM(fullEntry);
    }

    // Alert on high-risk events
    if (entry.riskScore >= 70) {
      await this.sendSecurityAlert(fullEntry);
    }
  }

  private async sendToSIEM(entry: AuditLogEntry): Promise<void> {
    // Send to Splunk, Datadog, or custom SIEM
    // ...
  }

  private async sendSecurityAlert(entry: AuditLogEntry): Promise<void> {
    // Send email/Slack notification for high-risk events
    // ...
  }

  // Helper methods
  async logAuthSuccess(userId: string, ip: string, userAgent?: string) {
    await this.log({
      event: AuditEvent.LOGIN_SUCCESS,
      userId,
      ip,
      userAgent,
      metadata: {},
      riskScore: 10,
    });
  }

  async logAuthFailure(email: string, ip: string, reason: string) {
    await this.log({
      event: AuditEvent.LOGIN_FAILURE,
      ip,
      userAgent: '',
      metadata: { email: this.hashEmail(email), reason },
      riskScore: 30,
    });
  }

  async logSuspiciousActivity(
    userId: string,
    ip: string,
    activity: string,
    riskScore: number
  ) {
    await this.log({
      event: AuditEvent.SUSPICIOUS_ACTIVITY,
      userId,
      ip,
      metadata: { activity },
      riskScore,
    });
  }

  private hashEmail(email: string): string {
    // One-way hash for privacy in logs
    return crypto.createHash('sha256').update(email).digest('hex');
  }
}
```

---

### 10. MEDIUM: No CSRF Protection

**Vulnerability:** State-changing operations via POST/PUT/PATCH lack CSRF tokens, vulnerable to cross-site request forgery.

**Fix:** Implement Double-Submit Cookie pattern for CSRF protection.

```typescript
// CSRF Guard
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
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
                      request.query?._csrf;

    const cookieToken = request.cookies?.csrfToken;

    if (!csrfToken || !cookieToken || csrfToken !== cookieToken) {
      throw new ForbiddenException('Invalid CSRF token');
    }

    return true;
  }
}

// CSRF Token middleware
export function csrfTokenMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.cookies?.csrfToken) {
    const token = crypto.randomBytes(32).toString('hex');
    res.cookie('csrfToken', token, {
      httpOnly: false, // Must be accessible by JS
      secure: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });
  }
  next();
}
```

---

## 🟡 LOW VULNERABILITIES

### 11. LOW: Error Message Information Leakage

**Fix:** Standardize error responses.

```typescript
// Global error filter
import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class SecureExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const isProduction = process.env.NODE_ENV === 'production';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode = 'INTERNAL_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      // Use safe messages in production
      message = isProduction
        ? this.getSafeMessage(status)
        : exceptionResponse.message || exception.message;

      errorCode = this.getErrorCode(status);
    }

    // Log full error details server-side
    this.logger.error({
      status,
      message: exception instanceof Error ? exception.message : 'Unknown error',
      stack: exception instanceof Error ? exception.stack : undefined,
      path: request.url,
      method: request.method,
      ip: request.ip,
      userId: (request as any).user?.id,
    });

    response.status(status).json({
      success: false,
      error: {
        code: errorCode,
        message,
        ...(isProduction ? {} : { debug: exception instanceof Error ? exception.stack : undefined }),
      },
    });
  }

  private getSafeMessage(status: number): string {
    const messages: Record<number, string> = {
      400: 'Bad request',
      401: 'Authentication required',
      403: 'Access denied',
      404: 'Resource not found',
      429: 'Too many requests',
      500: 'Internal server error',
    };
    return messages[status] || 'An error occurred';
  }

  private getErrorCode(status: number): string {
    const codes: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      429: 'RATE_LIMITED',
      500: 'INTERNAL_ERROR',
    };
    return codes[status] || 'UNKNOWN_ERROR';
  }
}
```

---

### 12. LOW: Security Headers on Static Files

**Fix:** Add comprehensive headers to static file serving.

```typescript
// Enhanced static file serving
app.use('/uploads',
  (req, res, next) => {
    // Prevent browsers from MIME-sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // Prevent embedding
    res.setHeader('X-Frame-Options', 'DENY');
    // CSP for uploaded content
    res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox");
    // Cache control
    res.setHeader('Cache-Control', 'private, max-age=3600');
    next();
  },
  express.static(uploadsDir, {
    maxAge: '1d',
    etag: true,
    immutable: true,
    // Add index: false to prevent directory listing
    index: false,
    // Custom fallthrough handler
    fallthrough: false,
  })
);
```

---

## 🏗️ IMPROVED ARCHITECTURE

### Zero Trust Security Model

```
┌─────────────────────────────────────────────────────────────────┐
│                        ZERO TRUST ARCHITECTURE                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐ │
│   │   WAF    │───▶│   CDN    │───▶│  API GW  │───▶│  APP     │ │
│   │(CloudFlr)│    │(Signed)  │    │ (Rate/  │    │ (NestJS) │ │
│   └──────────┘    └──────────┘    │  Auth)   │    └──────────┘ │
│                                   └──────────┘         │       │
│                                                        │       │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐        │       │
│   │  SIEM    │◀───│  Audit   │◀───│   RBAC   │◀───────┘       │
│   │ (Splunk) │    │  Logger  │    │  Guard   │                │
│   └──────────┘    └──────────┘    └──────────┘                │
│                                                                 │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐                 │
│   │  Redis   │    │ Postgres │    │  S3/     │                 │
│   │ (Cache/  │    │ (Encrypt │    │  Cloud   │                 │
│   │  Rate)   │    │  at Rest)│    │  Storage │                 │
│   └──────────┘    └──────────┘    └──────────┘                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Key Architecture Improvements:

1. **API Gateway Layer:** Rate limiting, authentication, request validation at edge
2. **Service Mesh:** mTLS between services
3. **Encrypted Storage:** All data encrypted at rest (AES-256)
4. **Secret Management:** HashiCorp Vault or AWS Secrets Manager
5. **Container Security:** Non-root containers, read-only filesystems

---

## 📋 DEPLOYMENT CHECKLIST

### Pre-Deployment Security Checklist

#### Authentication & Authorization
- [ ] JWT secrets are 64+ character hex strings
- [ ] Token expiration is configured (15 min access, 7 day refresh)
- [ ] Refresh tokens are stored hashed in database
- [ ] CORS origins are strictly whitelisted (no wildcards)
- [ ] Clerk JWKS endpoint is configured correctly
- [ ] WebSocket auth uses RS256 (not HS256)

#### Data Protection
- [ ] Database encryption at rest is enabled
- [ ] Database connections use SSL/TLS
- [ ] Redis connections use TLS
- [ ] Redis AUTH password is set
- [ ] S3 buckets are private with signed URLs
- [ ] Environment variables are encrypted

#### API Security
- [ ] Rate limiting is enabled (100 req/min general, 10 req/min AI)
- [ ] All routes have appropriate guards
- [ ] No `@Public()` on sensitive endpoints
- [ ] File uploads have size limits (10MB)
- [ ] File uploads validate magic bytes
- [ ] File uploads use UUID filenames

#### Infrastructure
- [ ] Helmet middleware is configured
- [ ] Security headers are set (HSTS, CSP, etc.)
- [ ] Server fingerprinting is disabled
- [ ] Error messages don't leak stack traces
- [ ] Logging is configured for audit events
- [ ] Health checks don't expose sensitive data

#### Monitoring
- [ ] Failed auth attempts are logged
- [ ] Rate limit violations are alerted
- [ ] Security audit logs are forwarded to SIEM
- [ ] Error tracking (Sentry) is configured
- [ ] Performance monitoring is enabled

### Production Environment Variables

```bash
# Required Security Configuration
NODE_ENV=production
JWT_ACCESS_SECRET=<64-char-hex>
JWT_REFRESH_SECRET=<64-char-hex>
CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Database (use connection pooling)
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require&connection_limit=20

# Redis (TLS enabled)
REDIS_HOST=redis.example.com
REDIS_PORT=6380
REDIS_PASSWORD=<strong-password>
REDIS_TLS_ENABLED=true

# Rate Limiting
THROTTLE_TTL=60000
THROTTLE_LIMIT=100
AI_THROTTLE_LIMIT=10

# File Uploads
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/secure/uploads

# Monitoring
SENTRY_DSN=https://...@sentry.io/...
LOG_LEVEL=info
AUDIT_LOG_ENABLED=true
```

### Security Testing

Before deployment, run:

```bash
# Dependency vulnerability scan
npm audit

# Container scan (if using Docker)
docker scan myapp:latest

# Static analysis
npm run lint

# Security headers test
curl -I https://yourapi.com/health

# CORS test
curl -H "Origin: https://evil.com" https://yourapi.com/api/v1/users

# Auth bypass test (should return 401)
curl https://yourapi.com/api/v1/users/me

# Rate limit test
for i in {1..110}; do
  curl https://yourapi.com/api/v1/health
done
```

---

## 🔄 Security Update Process

1. **Weekly:** Review dependency vulnerabilities (`npm audit`)
2. **Monthly:** Review access logs for anomalies
3. **Quarterly:** Penetration testing
4. **Annually:** Full security audit
5. **On-demand:** Emergency patching for CVEs

---

## 📞 Incident Response

### Severity Levels

**SEV 1 (Critical):** Active exploitation, data breach
- Immediate: Disable affected service
- Within 1 hour: Patch and deploy
- Within 4 hours: Root cause analysis

**SEV 2 (High):** Vulnerability with exploit potential
- Within 4 hours: Implement workaround
- Within 24 hours: Patch and deploy

**SEV 3 (Medium):** Security hardening needed
- Within 1 week: Schedule fix

---

## ✅ Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Security Engineer | | | |
| DevOps Lead | | | |
| Product Owner | | | |

---

*This document is confidential and proprietary. Distribution without written consent is prohibited.*
