import { DataModule } from '@/common/data/data.module';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { RedisModule } from '@/common/redis/redis.module';
import { Authentication } from '@/middleware/Authentication';
import { Oauth2Google } from '@/middleware/Oauth2Google';
import { RoleMiddleware } from '@/middleware/RoleMiddleware';
import { GoogleOAuth2Service } from '@/modules/auth/services/google-oauth2.service';
import { UsersModule } from '@/modules/users/users.module';
import { Module } from '@nestjs/common';

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
