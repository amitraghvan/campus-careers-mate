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
    sendRequest(@CurrentUser() user: { id: string }, @Param('userId') receiverId: string) {
        return this.peerConnectionService.sendRequest(user.id, receiverId);
    }

    @Patch('accept/:requestId')
    acceptRequest(@CurrentUser() user: { id: string }, @Param('requestId') requestId: string) {
        return this.peerConnectionService.respondToRequest(requestId, user.id, ConnectionStatus.ACCEPTED);
    }

    @Delete('reject/:requestId')
    rejectRequest(@CurrentUser() user: { id: string }, @Param('requestId') requestId: string) {
        return this.peerConnectionService.rejectRequest(requestId, user.id);
    }

    @Get()
    getConnections(@CurrentUser() user: { id: string }) {
        return this.peerConnectionService.getConnections(user.id);
    }

    @Get('incoming')
    getIncomingRequests(@CurrentUser() user: { id: string }) {
        return this.peerConnectionService.getIncomingRequests(user.id);
    }
}
