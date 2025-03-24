import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import modules from './import.module';
import AppController from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middleware/LoggerMiddleware';

@Module({
  imports: modules,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
