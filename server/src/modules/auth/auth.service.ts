/**
 * Auth Service — core authentication business logic.
 *
 * Handles: registration, login, token rotation, logout,
 * session management, and password hashing.
 *
 * ZERO business logic in controllers — everything lives here.
 */

import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { PrismaService } from "../../common/prisma/prisma.service";
import { RedisService } from "../../common/redis/redis.service";
import { SignUpDto, SignInDto } from "./dto";
import type { JwtPayload } from "./strategies/jwt.strategy";

const SALT_ROUNDS = 12;
const REFRESH_PREFIX = "refresh:";
const BLACKLIST_PREFIX = "bl:";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    college: string | null;
    avatarUrl: string | null;
  };
  tokens: TokenPair;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly redis: RedisService,
  ) { }

  // ── Sign Up ────────────────────────────────────

  async signUp(dto: SignUpDto, userAgent?: string, ip?: string): Promise<AuthResponse> {
    try {
      const emailLower = dto.email.toLowerCase().trim();

      // Check for duplicate
      const existing = await this.prisma.user.findUnique({
        where: { email: emailLower },
      });
      if (existing) {
        throw new ConflictException("An account with this email already exists");
      }

      // Hash password
      const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

      // Create user
      const user = await this.prisma.user.create({
        data: {
          email: emailLower,
          name: dto.name.trim(),
          passwordHash,
          college: dto.college?.trim() || null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          college: true,
          avatarUrl: true,
        },
      });

      // Generate tokens
      const tokens = await this.generateTokenPair(user.id, user.email, user.role, userAgent, ip);

      this.logger.log(`New user registered: ${user.email}`);

      return { user, tokens };
    } catch (error) {
      // Re-throw NestJS HTTP exceptions as-is (ConflictException, etc.)
      if (error instanceof ConflictException || error instanceof UnauthorizedException) {
        throw error;
      }

      // Log the actual error server-side
      this.logger.error(
        `Sign-up failed for ${dto.email}: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
      );

      // Return a user-friendly error
      throw new InternalServerErrorException(
        'Unable to create account. Please try again later.',
      );
    }
  }

  // ── Sign In ────────────────────────────────────

  async signIn(dto: SignInDto, userAgent?: string, ip?: string): Promise<AuthResponse> {
    try {
      const emailLower = dto.email.toLowerCase().trim();

      const user = await this.prisma.user.findUnique({
        where: { email: emailLower },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          college: true,
          avatarUrl: true,
          passwordHash: true,
          isActive: true,
        },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException("Invalid email or password");
      }

      const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
      if (!passwordValid) {
        throw new UnauthorizedException("Invalid email or password");
      }

      // Update last login
      await this.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      const tokens = await this.generateTokenPair(user.id, user.email, user.role, userAgent, ip);

      this.logger.log(`User signed in: ${user.email}`);

      // Omit passwordHash from response
      const { passwordHash: _, ...safeUser } = user;
      return { user: safeUser, tokens };
    } catch (error) {
      // Re-throw NestJS HTTP exceptions as-is
      if (error instanceof UnauthorizedException || error instanceof ConflictException) {
        throw error;
      }

      this.logger.error(
        `Sign-in failed for ${dto.email}: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
      );

      throw new InternalServerErrorException(
        'Unable to sign in. Please try again later.',
      );
    }
  }

  // ── Refresh Token ──────────────────────────────

  async refreshTokens(refreshToken: string, userAgent?: string, ip?: string): Promise<TokenPair> {
    // Find the stored refresh token
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: { select: { id: true, email: true, role: true, isActive: true } } },
    });

    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    if (!storedToken.user.isActive) {
      throw new UnauthorizedException("Account is inactive");
    }

    // Token rotation: revoke old, issue new
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    // Blacklist old access tokens for this user (best effort)
    await this.redis.set(
      `${BLACKLIST_PREFIX}${storedToken.token}`,
      "revoked",
      60 * 15, // 15 min (access token lifetime)
    );

    const tokens = await this.generateTokenPair(
      storedToken.user.id,
      storedToken.user.email,
      storedToken.user.role,
      userAgent,
      ip,
    );

    this.logger.debug(`Token rotated for user: ${storedToken.user.email}`);

    return tokens;
  }

  // ── Sign Out ───────────────────────────────────

  async signOut(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      // Revoke specific token
      await this.prisma.refreshToken.updateMany({
        where: { token: refreshToken, userId },
        data: { revokedAt: new Date() },
      });
    } else {
      // Revoke ALL tokens for user (logout everywhere)
      await this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    // Invalidate cached data
    await this.redis.delByPattern(`${REFRESH_PREFIX}${userId}:*`);

    this.logger.log(`User signed out: ${userId}`);
  }

  // ── Token Generation ───────────────────────────

  private async generateTokenPair(
    userId: string,
    email: string,
    role: string,
    userAgent?: string,
    ip?: string,
  ): Promise<TokenPair> {
    const payload: Omit<JwtPayload, "iat" | "exp"> = {
      sub: userId,
      email,
      role,
    };

    // Access token (short-lived)
    const accessToken = this.jwt.sign(payload, {
      secret: this.config.get("JWT_ACCESS_SECRET"),
      expiresIn: this.config.get("JWT_ACCESS_EXPIRY", "15m"),
    });

    // Refresh token (long-lived, stored in DB)
    const refreshToken = uuid();
    const refreshExpiry = this.config.get("JWT_REFRESH_EXPIRY", "7d");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(refreshExpiry, 10) || 7);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt,
        userAgent,
        ipAddress: ip,
      },
    });

    // Cache in Redis for fast lookup
    await this.redis.set(
      `${REFRESH_PREFIX}${userId}:${refreshToken}`,
      { userId, expiresAt: expiresAt.toISOString() },
      7 * 24 * 60 * 60, // 7 days
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }

  // ── Cleanup (scheduled) ────────────────────────

  async cleanupExpiredTokens(): Promise<number> {
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { revokedAt: { not: null } },
        ],
      },
    });

    if (result.count > 0) {
      this.logger.log(`Cleaned up ${result.count} expired/revoked refresh tokens`);
    }

    return result.count;
  }
}

