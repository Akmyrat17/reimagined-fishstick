import {
  createParamDecorator,
  ExecutionContext,
  ValidationError,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
export const RequestHeader = createParamDecorator(
  async (value: any, ctx: ExecutionContext) => {
    const headers = ctx.switchToHttp().getRequest().headers;
    const dto = plainToClass(value, headers, { excludeExtraneousValues: true });
    const errors: ValidationError[] = await validate(dto);
    if (errors.length > 0) {
      throw new Error(JSON.stringify(errors));
    }
    return dto;
  },
);
