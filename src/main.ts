import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging-interceptor';
import { LoggingExceptionFilter } from './common/http/logging-exception.filter';
import { ClassSerializerInterceptor, Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/http/exception.filter';
import { Reflector } from '@nestjs/core';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector))
  );
  const config: ConfigService = app.get(ConfigService);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.setGlobalPrefix(config.get('APP_PREFIX'));
  const port = config.get('APP_PORT');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(
    new LoggingExceptionFilter(),
    new HttpExceptionFilter(app.get(HttpAdapterHost)),
  );
  await app.listen(port);
}
bootstrap().then(() => {
  Logger.log(`Application is running on port ${process.env.APP_PORT}`);
});
