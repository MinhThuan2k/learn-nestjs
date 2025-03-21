import { Body, Controller, Injectable, Post, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service';
import { LoginUserDto } from '../dto/login.dto';

@Controller('users')
@Injectable()
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto, @Res() res: FastifyReply) {
    return this.authService.login(loginUserDto, res);
  }
}
