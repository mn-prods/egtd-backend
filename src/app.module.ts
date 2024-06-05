import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestContextMiddleware } from './custom-middleware/request-context.middleware';
import { AuthModule } from './resources/auth/auth.module';
import { FirebaseAuthStrategy } from './resources/auth/firebase-auth.strategy';
import { FirebaseJwtAuthGuard } from './resources/auth/firebase-jwt.guard';
import { InboxModule } from './resources/inbox/inbox.module';
import { UserModule } from './resources/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './ormconfig';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'firebase-jwt' }),
    TypeOrmModule.forRootAsync({
      useFactory() {
        return config;
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return addTransactionalDataSource(new DataSource(options));
      }
    }),
    AuthModule,
    ScheduleModule.forRoot(),
    UserModule,
    InboxModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    FirebaseAuthStrategy,
    {
      provide: APP_GUARD,
      useClass: FirebaseJwtAuthGuard
    }
  ],
  exports: [PassportModule]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
