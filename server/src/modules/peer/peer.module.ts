import { Module } from '@nestjs/common';
import { PeerProfileController } from './controllers/peer-profile.controller';
import { PeerProfileService } from './services/peer-profile.service';
import { PeerDiscoveryService } from './services/peer-discovery.service';
import { PeerConnectionController } from './controllers/peer-connection.controller';
import { PeerConnectionService } from './services/peer-connection.service';

@Module({
  controllers: [PeerProfileController, PeerConnectionController],
  providers: [PeerProfileService, PeerDiscoveryService, PeerConnectionService]
})
export class PeerModule {}
