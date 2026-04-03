import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

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
    this.isProduction = config.get<string>('NODE_ENV') === 'production';
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
    // Stub: Send to Splunk, Datadog, or custom SIEM
  }

  private async sendSecurityAlert(entry: AuditLogEntry): Promise<void> {
    // Stub: Send email/Slack notification for high-risk events
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
    return crypto.createHash('sha256').update(email).digest('hex');
  }
}
