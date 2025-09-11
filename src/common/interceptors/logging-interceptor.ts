import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body } = req;

    this.logger.log(
      `Incoming Request: ${method} ${url} - Payload: ${JSON.stringify(body)}`,
    );

    return next.handle().pipe(
      tap((data) => {
        this.logger.log(
          `Response: ${method} ${url} - Payload: ${JSON.stringify(data)}`,
        );
      }),
    );
  }
}
