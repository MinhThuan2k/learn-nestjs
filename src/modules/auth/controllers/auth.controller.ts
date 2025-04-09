import { Body, Controller, Injectable, Post, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '@/modules/auth/services/auth.service';
import { NoAuth } from '@/middleware/NoAuth';
import { ValidationPipe } from '@/common/validations/ValidationPipe';
import { LoginUserDto } from '@/modules/auth/dto/login.dto';

@ApiTags('Authentication')
@Controller({ version: '1' })
@Injectable()
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @NoAuth()
  @Post('sign-in')
  @ApiOperation({ summary: 'Login JWT Token', description: 'Login JWT Token' })
  async signIn(
    @Body(new ValidationPipe()) loginUserDto: LoginUserDto,
    @Res() response: FastifyReply,
  ) {
    const result = await this.authService.signIn(loginUserDto);

    return response.send(result);
  }
}
