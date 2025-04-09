import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { Authentication } from './middleware/Authentication';
import { PrismaModule } from './common/prisma/prisma.module';
import { RedisModule } from './common/redis/redis.module';
import { DataModule } from './common/data/data.module';
import { Oauth2Google } from './middleware/Oauth2Google';
import { GoogleOAuth2Service } from './modules/auth/services/google-oauth2.service';
import { RoleMiddleware } from './middleware/RoleMiddleware';

@Module({
  imports: [UsersModule, PrismaModule, RedisModule, DataModule],
  providers: [
    { provide: 'APP_GUARD', useClass: Authentication },
    { provide: 'APP_GUARD', useClass: RoleMiddleware },
    Oauth2Google,
    GoogleOAuth2Service,
  ],
  exports: [UsersModule],
})
export class ImportModule {}
