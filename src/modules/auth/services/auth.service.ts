import { Injectable, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { LoginUserDto } from '../dto/login.dto';
import { plainToClass } from 'class-transformer';
import { LoginTransform } from '../transformers/login.transform';

@Injectable()
export class AuthService {
  login(dto: LoginUserDto, @Res() res: FastifyReply) {
    const result = plainToClass(LoginTransform, {
      email: dto.email,
      token: 'token',
      password: dto.password,
    });
    return res.send(result);
  }
}
