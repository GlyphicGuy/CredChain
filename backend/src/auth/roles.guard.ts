import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    // Fallback logic for Hackathon/V1: 
    // In production, user roles are typically mapped in Clerk publicMetadata.
    // For V1, we map role implicitly or expect it in publicMetadata.role.
    // If not present, we deny access.
    const userRole = user?.publicMetadata?.role;
    console.log(`[RolesGuard] requiredRoles:`, requiredRoles);
    console.log(`[RolesGuard] userRole:`, userRole);
    
    // In Developer Mode, ClerkJwtGuard injects the mock role correctly into user.publicMetadata.role
    // No bypass needed here.

    if (!userRole || !requiredRoles.includes(userRole as string)) {
      console.log(`[RolesGuard] FORBIDDEN! throwing error.`);
      throw new ForbiddenException('Insufficient permissions');
    }

    console.log(`[RolesGuard] Allowed!`);
    return true;
  }
}
