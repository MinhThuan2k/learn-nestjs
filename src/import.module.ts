import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { Authentication } from './middleware/Authentication';
import { PrismaModule } from './common/prisma/prisma.module';

@Module({
  imports: [UsersModule, PrismaModule],
  providers: [{ provide: 'APP_GUARD', useClass: Authentication }],
  exports: [UsersModule],
})
export class ImportModule {}
