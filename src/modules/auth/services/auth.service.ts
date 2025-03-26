import { HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserDto } from '../dto/login.dto';
import { plainToClass } from 'class-transformer';
import { LoginTransform } from '../transformers/login.transform';
import { UserException } from '../../../exceptions/UserException';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { expiresIn, isMultipleDevice } from '../../../config/jwt';
import { Payload } from '../interface/InterfacePayload';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { RedisService } from '../../../common/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async signIn(dto: LoginUserDto): Promise<LoginTransform | object | void> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
        password: dto.password,
      },
    });
    if (!user) {
      throw new UserException(
        'Email or password is incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload: Payload = { sub: user.id };
    if (isMultipleDevice) {
      payload.jit = uuidv4();
    }
    const token = await this.jwtService.signAsync(payload);

    await this.redisService.set(
      this.redisService.prefixUser + ':' + token,
      token,
      expiresIn,
    );
    const result = plainToClass(LoginTransform, {
      token: token,
      user: user,
    });

    return result;
  }
}
