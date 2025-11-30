import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UsersEntity } from '../../modules/users/entities/user.entity';
export const CurrentUser = createParamDecorator(
    (data: keyof UsersEntity | undefined, ctx: ExecutionContext) => { // Use keyof UsersEntity for better type safety
        const request = ctx.switchToHttp().getRequest();
        const user = request.user as UsersEntity;
        if (!user) return null;
        if (data && user[data as keyof UsersEntity]) {
            return user[data as keyof UsersEntity]; 
        }
        return user;
    },
);