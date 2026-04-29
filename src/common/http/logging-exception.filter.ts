import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';

@Catch()
export class LoggingExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(LoggingExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const message = exception instanceof HttpException ? exception.getResponse() : exception.message;

    // ✅ Only log, never send a response
    this.logger.error(
      `${request.method} ${request.url} ${status} — ${JSON.stringify(message)}`,
    );

    // ✅ Do NOT call response.status().json() here
    // Let HttpExceptionFilter handle the actual response
  }
}