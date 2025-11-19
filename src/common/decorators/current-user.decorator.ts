import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UsersEntity } from '../../modules/users/entities/user.entity';
export const CurrentUser = createParamDecorator(
    (data: keyof UsersEntity | undefined, ctx: ExecutionContext) => { // Use keyof UsersEntity for better type safety
        const request = ctx.switchToHttp().getRequest();
        const user = request.user as UsersEntity;
        console.log(user)
        if (!user) return null;
        console.log('data:', data); // Should be 'id' from the controller
        
        // 🚨 CORRECTED LINE: Access property directly without '$'
        if (data && user[data as keyof UsersEntity]) {
            console.log('Property Value:', user[data as keyof UsersEntity]);
            // Returns the property value (e.g., the number 1)
            return user[data as keyof UsersEntity]; 
        }

        console.log('Full User:', user);
        // Returns the full UsersEntity object if no data key is provided
        return user;
    },
);