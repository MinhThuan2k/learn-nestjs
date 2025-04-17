import AppController from '@/app.controller';
import { AppService } from '@/app.service';
import { DataModule } from '@/common/data/data.module';
import { Authentication } from '@/middleware/Authentication';
import { LoggerMiddleware } from '@/middleware/LoggerMiddleware';
import { Oauth2Google } from '@/middleware/Oauth2Google';
import { RoleMiddleware } from '@/middleware/RoleMiddleware';
import {
  AuthModule,
  PrismaModule,
  ProjectModule,
  RedisModule,
  UsersModule,
} from '@/modules';
import { GoogleOAuth2Service } from '@/modules/auth/services/google-oauth2.service';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

const imports = [
  AuthModule,
  UsersModule,
  PrismaModule,
  RedisModule,
  DataModule,
  ProjectModule,
];

const exportsModule = [UsersModule];

const controllers = [AppController];

const providers = [
  { provide: 'APP_GUARD', useClass: Authentication },
  { provide: 'APP_GUARD', useClass: RoleMiddleware },
  AppService,
  Oauth2Google,
  GoogleOAuth2Service,
];
@Module({
  imports: imports,
  exports: exportsModule,
  controllers: controllers,
  providers: providers,
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*path');
  }
}
