import { Controller, Get, Param, Patch, Post, Delete, UseGuards } from '@nestjs/common';
import { PeerConnectionService } from '../services/peer-connection.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { ConnectionStatus } from '@prisma/client';

@Controller('peers/connections')
@UseGuards(JwtAuthGuard)
export class PeerConnectionController {
    constructor(private readonly peerConnectionService: PeerConnectionService) { }

    @Post('request/:userId')
    sendRequest(@CurrentUser() user: any, @Param('userId') receiverId: string) {
        return this.peerConnectionService.sendRequest(user.userId, receiverId);
    }

    @Patch('accept/:requestId')
    acceptRequest(@CurrentUser() user: any, @Param('requestId') requestId: string) {
        return this.peerConnectionService.respondToRequest(requestId, user.userId, ConnectionStatus.ACCEPTED);
    }

    @Delete('reject/:requestId')
    rejectRequest(@CurrentUser() user: any, @Param('requestId') requestId: string) {
        return this.peerConnectionService.rejectRequest(requestId, user.userId);
    }

    @Get()
    getConnections(@CurrentUser() user: any) {
        return this.peerConnectionService.getConnections(user.userId);
    }

    @Get('incoming')
    getIncomingRequests(@CurrentUser() user: any) {
        return this.peerConnectionService.getIncomingRequests(user.userId);
    }
}
