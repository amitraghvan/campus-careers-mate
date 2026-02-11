import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PeerDiscoveryQueryDto {
    @IsString()
    @IsOptional()
    college?: string;

    @IsString()
    @IsOptional()
    role?: string;

    @IsInt()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    page?: number = 1;

    @IsInt()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    limit?: number = 10;
}
