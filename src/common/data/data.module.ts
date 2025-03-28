import { Global, Module } from '@nestjs/common';
import { UserDataService } from './user.service';

@Global()
@Module({
  providers: [UserDataService],
  exports: [UserDataService],
})
export class DataModule {}
