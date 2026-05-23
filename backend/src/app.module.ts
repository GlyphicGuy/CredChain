import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { CredentialsModule } from './credentials/credentials.module';
import { AuthModule } from './auth/auth.module';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    PrismaModule, 
    BlockchainModule, 
    CredentialsModule,
    AuthModule,
    StudentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
