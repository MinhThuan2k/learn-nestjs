import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { Authentication } from './middleware/Authentication';
import { PrismaModule } from './common/prisma/prisma.module';
import { RedisModule } from './common/redis/redis.module';
import { DataModule } from './common/data/data.module';

@Module({
  imports: [UsersModule, PrismaModule, RedisModule, DataModule],
  providers: [{ provide: 'APP_GUARD', useClass: Authentication }],
  exports: [UsersModule],
})
export class ImportModule {}
