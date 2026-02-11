import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreatePeerProfileDto {
    @IsString()
    college: string;

    @IsArray()
    @IsString({ each: true })
    targetJobRoles: string[];

    @IsString()
    placementStage: string;

    @IsString()
    @IsOptional()
    headline?: string;
}
