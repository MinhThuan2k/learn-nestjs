import { Module } from '@nestjs/common';
import modules from './import.module';
import AppController from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: modules,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
