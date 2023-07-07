import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './resources/auth/auth.module';
import { RequestContextMiddleware } from './custom-middleware/request-context.middleware';
import { config } from './ormconfig';
import { UserModule } from './resources/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAuthStrategy } from './resources/auth/firebase-auth.strategy';
import { APP_GUARD } from '@nestjs/core';
import { FirebaseJwtAuthGuard } from './resources/auth/firebase-jwt.guard';
import { InboxModule } from './inbox/inbox.module';

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
