/**
 * Auth DTOs — validated request payloads for auth endpoints.
 */

import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class SignUpDto {
  @ApiProperty({ example: "Amit Kumar" })
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  @MinLength(2, { message: "Name must be at least 2 characters" })
  @MaxLength(50)
  @Matches(/^[a-zA-Z\s'-]+$/, {
    message: "Name can only contain letters, spaces, hyphens, and apostrophes",
  })
  name!: string;

  @ApiProperty({ example: "amit@example.com" })
  @IsEmail({}, { message: "Please enter a valid email address" })
  email!: string;

  @ApiProperty({ example: "securePassword123" })
  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters" })
  @MaxLength(128)
  password!: string;

  @ApiPropertyOptional({ example: "IIT Delhi" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  college?: string;
}

export class SignInDto {
  @ApiProperty({ example: "amit@example.com" })
  @IsEmail({}, { message: "Please enter a valid email address" })
  email!: string;

  @ApiProperty({ example: "securePassword123" })
  @IsString()
  @IsNotEmpty({ message: "Password is required" })
  password!: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}

