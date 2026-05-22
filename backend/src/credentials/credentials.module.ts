import { Module } from '@nestjs/common';
import { CredentialsController } from './credentials.controller';
import { CredentialsService } from './credentials.service';
import { BlockchainModule } from '../blockchain/blockchain.module';

@Module({
  imports: [BlockchainModule],
  controllers: [CredentialsController],
  providers: [CredentialsService],
})
export class CredentialsModule {}
