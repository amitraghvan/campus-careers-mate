import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { PeerProfileService } from '../services/peer-profile.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator'; // Assuming this exists, I saw it in list_dir
import { CreatePeerProfileDto } from '../dto/create-peer-profile.dto';
import { PeerDiscoveryService } from '../services/peer-discovery.service';
import { PeerDiscoveryQueryDto } from '../dto/peer-discovery-query.dto';

@Controller('peers/profile')
@UseGuards(JwtAuthGuard)
export class PeerProfileController {
    constructor(
        private readonly peerProfileService: PeerProfileService,
        private readonly peerDiscoveryService: PeerDiscoveryService,
    ) { }

    @Get('discover')
    discover(@CurrentUser() user: any, @Query() query: PeerDiscoveryQueryDto) {
        return this.peerDiscoveryService.discoverPeers(user.userId, query);
    }

    @Post()
    createOrUpdate(@CurrentUser() user: any, @Body() dto: CreatePeerProfileDto) {
        return this.peerProfileService.createOrUpdate(user.userId, dto);
    }

    @Get('me')
    getMyProfile(@CurrentUser() user: any) {
        return this.peerProfileService.getMyProfile(user.userId);
    }

    @Get(':id')
    getProfile(@Param('id') id: string) {
        return this.peerProfileService.getProfileById(id);
    }
}
