import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggingMiddleware } from './common/middlewares/logging-middleware';
import { AllModule } from './modules/all.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormConfig from './config/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { BullModule } from '@nestjs/bullmq';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ActiveUsersTracker } from './modules/users/services/active-users-tracker.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const config = configService.get('typeorm')
        if (!config) {
          throw new Error('TypeORM config not found')
        }
        return config
      },
    }),
    AllModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeormConfig]
    }),
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisHost = configService.get('REDIS_HOST')
        const redisPort = configService.get('REDIS_PORT')
        if (!redisHost || !redisPort) throw new Error('Cache config not found')
        return {
          stores: [
            new KeyvRedis(`redis://${redisHost}:${redisPort}`),
          ],
        };
      },
      isGlobal: true
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisHost = configService.get('REDIS_HOST')
        const redisPort = configService.get('REDIS_PORT')
        if (!redisHost || !redisPort) throw new Error('Cache config not found')
        return {
          connection: {
            host: redisHost,
            port: redisPort,
          },
        };
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,   // 1 minute in ms
        limit: 200,    // 20 requests per IP
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,  // applies globally to all routes
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*'); // Apply to all routes
  }
}
