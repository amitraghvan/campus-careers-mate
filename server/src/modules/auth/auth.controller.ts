/**
 * Auth Controller — thin HTTP layer, zero business logic.
 */

import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { SignUpDto, SignInDto, RefreshTokenDto } from "./dto";
import { Public } from "./decorators/public.decorator";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  @Public()
  @HttpCode(HttpStatus.CREATED)
  // Security: 3 signup attempts per 10 minutes per IP — prevents account spam
  @Throttle({ default: { limit: 3, ttl: 600_000 } })
  @ApiOperation({ summary: "Register a new account" })
  async signUp(@Body() dto: SignUpDto, @Req() req: Request) {
    return this.authService.signUp(
      dto,
      req.headers["user-agent"],
      req.ip,
    );
  }

  @Post("signin")
  @Public()
  @HttpCode(HttpStatus.OK)
  // Security: 5 signin attempts per 5 minutes per IP — blocks credential stuffing
  @Throttle({ default: { limit: 5, ttl: 300_000 } })
  @ApiOperation({ summary: "Sign in with email and password" })
  async signIn(@Body() dto: SignInDto, @Req() req: Request) {
    return this.authService.signIn(
      dto,
      req.headers["user-agent"],
      req.ip,
    );
  }

  @Post("refresh")
  @Public()
  @HttpCode(HttpStatus.OK)
  // Security: 10 refresh attempts per minute — prevents refresh-token brute force
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @ApiOperation({ summary: "Refresh access token using refresh token" })
  async refresh(@Body() dto: RefreshTokenDto, @Req() req: Request) {
    return this.authService.refreshTokens(
      dto.refreshToken,
      req.headers["user-agent"],
      req.ip,
    );
  }

  @Post("signout")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Sign out and revoke tokens" })
  async signOut(
    @CurrentUser("id") userId: string,
    @Body() body: { refreshToken?: string },
  ) {
    await this.authService.signOut(userId, body.refreshToken);
    return { message: "Signed out successfully" };
  }
}

