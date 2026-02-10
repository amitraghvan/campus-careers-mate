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
