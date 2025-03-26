import { Module } from '@nestjs/common';
import AuthController from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { LoginUserDto } from './dto/login.dto';
import { LoginTransform } from './transformers/login.transform';
import { JwtModule } from '@nestjs/jwt';
import { jwtSecret, signOptions } from '../../config/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtSecret,
      signOptions: signOptions,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LoginUserDto, LoginTransform],
})
export class AuthModule {}
