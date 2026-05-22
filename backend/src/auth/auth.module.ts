import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ClerkJwtGuard } from './clerk-jwt.guard';
import { RolesGuard } from './roles.guard';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: ClerkJwtGuard, // Globally protect all endpoints by default
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // Globally enforce roles where @Roles is present
    },
  ],
})
export class AuthModule {}
