import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verifyToken } from '@clerk/backend';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class ClerkJwtGuard implements CanActivate {
  private readonly logger = new Logger(ClerkJwtGuard.name);

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    // DEVELOPER MODE BYPASS
    const isDevMode = process.env.DEV_MODE === 'true' && process.env.NODE_ENV !== 'production';
    const devRole = request.headers['x-dev-role'];

    if (isDevMode && devRole) {
      let email = '';
      if (devRole === 'institution') email = 'stanford@credchain.dev';
      else if (devRole === 'student') email = 'alice@credchain.dev';
      else if (devRole === 'verifier') email = 'recruiter@credchain.dev';

      request['user'] = {
        sub: `dev_${devRole}`,
        publicMetadata: { role: devRole.charAt(0).toUpperCase() + devRole.slice(1) },
        email_addresses: [{ email_address: email }]
      };
      return true;
    }

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      request['user'] = decoded;
    } catch (error) {
      this.logger.error('JWT Verification failed', error);
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
