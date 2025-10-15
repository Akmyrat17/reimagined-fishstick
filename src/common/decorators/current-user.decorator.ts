import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UsersEntity } from '../../modules/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): UsersEntity => {
        const request = ctx.switchToHttp().getRequest<Request>();
        const user = request.user as UsersEntity;

        if (!user) {
            throw new UnauthorizedException('User not found in request');
        }

        return user;
    },
);