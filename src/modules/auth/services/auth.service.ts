import { HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserDto } from '../dto/login.dto';
import { plainToClass } from 'class-transformer';
import { LoginTransform } from '../transformers/login.transform';
import { UserException } from '../../../exceptions/UserException';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { expiresInRedis, isMultipleDevice } from '../../../config/jwt';
import { Payload } from '../interface/InterfacePayload';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { RedisService } from '../../../common/redis/redis.service';
import { compareBcrypt } from '../../../common/helpers/function';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async signIn(dto: LoginUserDto): Promise<LoginTransform> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (!user || !(await compareBcrypt(dto.password, user.password))) {
      throw new UserException(
        'Email or Password is incorrect!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload: Payload = {
      sub: user.id,
      ...(isMultipleDevice && { jit: uuidv4() }),
    };
    const token = await this.jwtService.signAsync(payload);
    const cryptoToken = await this.redisService.encryptToken(token);

    await this.redisService.set(
      `${this.redisService.prefixUser}:${user.id}:${isMultipleDevice ? payload.jit : user.id}`,
      cryptoToken,
      expiresInRedis,
    );

    return plainToClass(LoginTransform, { token, user });
  }
}
