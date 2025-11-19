import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { EntityNotFoundError, QueryFailedError, TypeORMError } from 'typeorm';
import { DbErrorType } from '../enums';
import { AuthErrorTypeEnum } from '../enums/auth-error-type.enum';

@Catch(HttpException, QueryFailedError, EntityNotFoundError, TypeORMError)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(protected readonly httpAdapterHost: HttpAdapterHost) { }
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const { httpAdapter } = this.httpAdapterHost;
    if (exception.code) {
      switch (exception.code) {
        case DbErrorType.CHECK_CONSTRAINT:
          httpAdapter.reply(
            response,
            {
              statusCode: 500,
              method: request.method,
              path: request.url,
              time: new Date().getTime(),
              message: exception.message,
            },
            500,
          );
          break;
        case DbErrorType.NOT_NULL_CONSTRAINT:
          httpAdapter.reply(
            response,
            {
              statusCode: 500,
              method: request.method,
              path: request.url,
              time: new Date().getTime(),
              message: exception.message,
            },
            500,
          );
          break;
        case DbErrorType.FOREIGN_KEY_CONSTRAINT:
          httpAdapter.reply(
            response,
            {
              statusCode: 500,
              method: request.method,
              path: request.url,
              time: new Date().getTime(),
              message: exception.message,
            },
            500,
          );
          break;
        case DbErrorType.MISSING_COLUMN:
          httpAdapter.reply(
            response,
            {
              statusCode: 500,
              method: request.method,
              path: request.url,
              time: new Date().getTime(),
              message: exception.message,
            },
            500,
          );
          break;
        case DbErrorType.UNIQUE_CONSTRAINT:
          httpAdapter.reply(
            response,
            {
              statusCode: 500,
              method: request.method,
              path: request.url,
              time: new Date().getTime(),
              message: exception.detail,
            },
            500,
          );
          break;
      }
    } else if (exception.status) {
      if (exception.status == AuthErrorTypeEnum.INVALID_CREDENTIALS) {
        httpAdapter.reply(
          response,
          {
            statusCode: 401,
            method: request.method,
            path: request.url,
            time: new Date().getTime(),
            message: exception.response.message
              ? exception.response.message
              : exception.message,
          },
          401,
        );
      } else {
        httpAdapter.reply(
          response,
          {
            statusCode: 400,
            method: request.method,
            path: request.url,
            time: new Date().getTime(),
            message: exception.response.message
              ? exception.response.message
              : exception.message,
          },
          400,
        );
      }
    } else {
      httpAdapter.reply(
        response,
        {
          statusCode: 400,
          method: request.method,
          path: request.url,
          time: new Date().getTime(),
          message: exception.response?.message
            ? exception.response?.message
            : exception.message,
        },
        400,
      );
    }
  }
}
