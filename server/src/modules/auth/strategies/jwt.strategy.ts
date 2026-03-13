/**
 * JWT Strategy — validates Clerk-issued Bearer tokens.
 *
 * Clerk signs JWTs using RS256. We verify them against Clerk's JWKS endpoint.
 * On first login, the user record is auto-provisioned in the DB.
 */

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { passportJwtSecret } from "jwks-rsa";
import { PrismaService } from "../../../common/prisma/prisma.service";

export interface JwtPayload {
  sub: string;          // Clerk user ID (e.g. "user_2abc...")
  email?: string;       // from Clerk token claims
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// Derive JWKS URL from the Clerk publishable key
// pk_test_BASE64 → decode base64 → "domain$" → strip "$" → prepend https://
function getClerkJwksUri(publishableKey: string): string {
  const base64Part = publishableKey.replace(/^pk_(test|live)_/, "");
  const decoded = Buffer.from(base64Part, "base64").toString("utf-8");
  const domain = decoded.replace(/\$$/, "").trim();
  return `https://${domain}/.well-known/jwks.json`;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    _config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    // Read directly from process.env — ConfigService may not be ready
    // when the Strategy super() constructor runs
    const publishableKey = process.env.CLERK_PUBLISHABLE_KEY ?? "";
    const jwksUri = publishableKey
      ? getClerkJwksUri(publishableKey)
      : "https://sure-mako-81.clerk.accounts.dev/.well-known/jwks.json"; // fallback

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        cacheMaxEntries: 5,
        cacheMaxAge: 24 * 60 * 60 * 1000, // cache keys for 24 hours
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri,
        handleSigningKeyError: (err, cb) => {
          console.error("[JwtStrategy] JWKS signing key error — check internet connectivity:", err?.message);
          cb(err);
        },
      }),
      algorithms: ["RS256"],
    });

    // Warm up JWKS cache at startup so the first real request doesn't block
    this.warmUpJwks(jwksUri);
  }

  /** Pre-fetch JWKS keys so they are cached before the first user request. */
  private warmUpJwks(jwksUri: string): void {
    fetch(jwksUri)
      .then(() => console.log(`[JwtStrategy] ✅ JWKS keys cached from ${jwksUri}`))
      .catch((err) =>
        console.warn(
          `[JwtStrategy] ⚠️  JWKS warm-up failed — auth will retry on first request. Is the internet reachable? Error: ${err?.message}`,
        ),
      );
  }

  async validate(payload: JwtPayload) {
    const clerkUserId = payload.sub;
    if (!clerkUserId) throw new UnauthorizedException("Invalid token");

    // Extract email from Clerk token (may be in 'email' or nested)
    const email: string =
      payload.email ||
      payload.primary_email_address ||
      `${clerkUserId}@placeholder.local`;

    // Auto-provision user in DB on first login
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { id: clerkUserId },
          { email: email.toLowerCase() },
        ],
      },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });

    if (!user) {
      // Create user record for new Clerk user
      const name =
        (payload.first_name && payload.last_name
          ? `${payload.first_name} ${payload.last_name}`
          : payload.first_name || payload.name || email.split("@")[0]);

      user = await this.prisma.user.create({
        data: {
          id: clerkUserId,
          email: email.toLowerCase(),
          name,
          passwordHash: "CLERK_MANAGED", // not used — Clerk handles auth
          college: null,
        },
        select: { id: true, email: true, name: true, role: true, isActive: true },
      });
    } else if (user.id !== clerkUserId) {
      // Edge case: user was found by email but has a different ID (e.g. local account).
      // Update their ID to the Clerk ID so FK constraints work correctly.
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { id: clerkUserId },
        select: { id: true, email: true, name: true, role: true, isActive: true },
      });
    }

    if (!user.isActive) {
      throw new UnauthorizedException("Account is inactive");
    }

    return user;
  }
}
