import { Catch, HttpException, ExceptionFilter, Logger, ArgumentsHost } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { QueryFailedError, EntityNotFoundError, TypeORMError } from "typeorm";
import { DbErrorType } from "../enums";

@Catch(HttpException, QueryFailedError, EntityNotFoundError, TypeORMError)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  constructor(protected readonly httpAdapterHost: HttpAdapterHost) { }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const { httpAdapter } = this.httpAdapterHost;

    const meta = {
      method: request.method,
      path: request.url,
      time: new Date().getTime(),
    };

    this.logger.error(`${meta.method} ${meta.path} — ${exception.message}`);

    // DB errors
    if (exception.code) {
      const dbMessages: Record<string, string> = {
        [DbErrorType.UNIQUE_CONSTRAINT]: exception.detail,
        [DbErrorType.CHECK_CONSTRAINT]: exception.message,
        [DbErrorType.NOT_NULL_CONSTRAINT]: exception.message,
        [DbErrorType.FOREIGN_KEY_CONSTRAINT]: exception.message,
        [DbErrorType.MISSING_COLUMN]: exception.message,
      };
      const message = dbMessages[exception.code] ?? exception.message;
      return httpAdapter.reply(response, { statusCode: 500, ...meta, message }, 500);
    }

    // HTTP exceptions
    const status = exception.status ?? 500;  // ✅ fallback to 500
    const message = exception.response?.message ?? exception.message;
    return httpAdapter.reply(response, { statusCode: status, ...meta, message }, status);
  }
}