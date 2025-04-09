import AppController from '@/app.controller';
import { AppService } from '@/app.service';
import { ImportModule } from '@/import.module';
import { LoggerMiddleware } from '@/middleware/LoggerMiddleware';
import { AuthModule } from '@/modules/auth/auth.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

@Module({
  imports: [ImportModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*path');
  }
}
