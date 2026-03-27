// src/guards/permissions.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS } from '../decorators/permissions.decorator';
import { UsersEntity } from 'src/modules/users/entities/users.entity';
import { RolesEnum } from '../enums';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
            PERMISSIONS,
            [context.getHandler(), context.getClass()]
        );

        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user: UsersEntity = request.user;
        if (!user) {
            return false;
        }
        if (user.role === RolesEnum.ADMIN) return true
        if (user.role !== RolesEnum.MODERATOR) return false
        return this.hasPermissions(user, requiredPermissions);
    }

    private hasPermissions(user: UsersEntity, requiredPermissions: string[]): boolean {
        if (user.permissions && Array.isArray(user.permissions)) {
            const userPermissionNames = user.permissions.map(p => p.name);
            return requiredPermissions.every(permission =>
                userPermissionNames.includes(permission)
            );
        }
        return false;
    }
}