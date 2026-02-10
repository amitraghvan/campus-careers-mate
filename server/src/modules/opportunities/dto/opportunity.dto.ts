/**
 * Opportunity DTOs — validated request payloads.
 */

import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  MaxLength,
  IsInt,
  Min,
  Max,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";

export enum OpportunityStatusEnum {
  WISHLIST = "WISHLIST",
  APPLIED = "APPLIED",
  INTERVIEW = "INTERVIEW",
  SELECTED = "SELECTED",
  REJECTED = "REJECTED",
}

export class CreateOpportunityDto {
  @ApiProperty({ example: "Google" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  company!: string;

  @ApiProperty({ example: "Software Engineer" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  role!: string;

  @ApiProperty({ enum: OpportunityStatusEnum, default: "WISHLIST" })
  @IsEnum(OpportunityStatusEnum)
  @IsOptional()
  status?: OpportunityStatusEnum;

  @ApiProperty({ example: "2026-03-15" })
  @IsDateString()
  deadline!: string;

  @ApiPropertyOptional({ example: "₹45 LPA" })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  package?: string;

  @ApiPropertyOptional({ example: "Focus on DSA prep" })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notes?: string;
}

export class UpdateOpportunityDto extends PartialType(CreateOpportunityDto) {}

export class UpdateStatusDto {
  @ApiProperty({ enum: OpportunityStatusEnum })
  @IsEnum(OpportunityStatusEnum)
  status!: OpportunityStatusEnum;
}

// ── Checklist DTOs ───────────────────────────────

export class CreateChecklistItemDto {
  @ApiProperty({ example: "Revise graph algorithms" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  text!: string;
}

export class UpdateChecklistItemDto {
  @ApiPropertyOptional({ example: "Updated task text" })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  text?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  done?: boolean;
}

// ── Query DTOs ───────────────────────────────────

export class OpportunityQueryDto {
  @ApiPropertyOptional({ enum: OpportunityStatusEnum })
  @IsOptional()
  @IsEnum(OpportunityStatusEnum)
  status?: OpportunityStatusEnum;

  @ApiPropertyOptional({ example: "Google" })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({ enum: ["deadline", "createdAt", "company"] })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ enum: ["asc", "desc"], default: "desc" })
  @IsOptional()
  @IsString()
  sortOrder?: "asc" | "desc";
}
