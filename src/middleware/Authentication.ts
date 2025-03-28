import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { expiresInRedis, jwtSecret } from '../config/jwt';
import { FastifyRequest } from 'fastify';
import { Reflector } from '@nestjs/core';
import { UserException } from '../exceptions/UserException';
import { Payload } from '../modules/auth/interface/InterfacePayload';
import { RedisService } from '../common/redis/redis.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class Authentication implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private readonly redisService: RedisService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const noAuth = this.reflector.get<boolean>('noAuth', context.getHandler());
    if (noAuth) {
      return true; // next guard
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UserException('Token in not provider', HttpStatus.UNAUTHORIZED);
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtSecret,
      });

      const key =
        this.redisService.prefixUser + ':' + payload.sub + ':' + token;
      const userData = await this.redisService.get(key);
      if (!userData) {
        throw new JsonWebTokenError('Invalid token');
      }

      const user = await this.prisma.user.findFirst({
        where: {
          id: payload.sub,
        },
      });

      if (!user) {
        throw new JsonWebTokenError('User not found');
      }

      if (
        user.password_changed_at &&
        new Date(payload.iat * 1000) < user.password_changed_at
      ) {
        throw new JsonWebTokenError('Token expired');
      }

      Object.assign(payload, {
        id: user.id,
        name: user.name,
        email: user.email,
      });

      request['user'] = payload;
      await this.redisService.client.expire(key, expiresInRedis); // Reset TTL
    } catch (e) {
      if (e instanceof JsonWebTokenError) {
        throw new JsonWebTokenError(e.message);
      }
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

export interface FastifyRequestWithUser extends FastifyRequest {
  user: Payload &
    Pick<User, 'id' | 'email' | 'name'> & {
      iat: number;
      exp: number;
    };
}
