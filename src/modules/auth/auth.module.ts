import { Module } from '@nestjs/common';
import AuthController from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { LoginUserDto } from './dto/login.dto';
import { LoginTransform } from './transformers/login.transform';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LoginUserDto, LoginTransform],
})
export class AuthModule {}
