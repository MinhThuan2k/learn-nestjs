import { Module } from '@nestjs/common';
import AuthController from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { LoginUserDto } from './dto/login.dto';
import { LoginTransform } from './transformers/login.transform';
import { JwtModule } from '@nestjs/jwt';
import { jwtSecret, signOptions } from '../../config/jwt';
import { GoogleOAuth2Service } from './services/google-oauth2.service';
import OAuth2Controller from './controllers/oauth2.controller';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtSecret,
      signOptions: signOptions,
    }),
  ],
  controllers: [AuthController, OAuth2Controller],
  providers: [AuthService, GoogleOAuth2Service, LoginUserDto, LoginTransform],
})
export class AuthModule {}
