import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { expiresIn, jwtSecret } from '../config/jwt';
import { FastifyRequest } from 'fastify';
import { Reflector } from '@nestjs/core';
import { UserException } from '../exceptions/UserException';
import { Payload } from '../modules/auth/interface/InterfacePayload';
import { RedisService } from '../common/redis/redis.service';

@Injectable()
export class Authentication implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private readonly redisService: RedisService,
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

      request['user'] = payload;

      const key = this.redisService.prefixUser + ':' + token;
      const userData = await this.redisService.get(key);
      if (!userData) {
        throw new JsonWebTokenError('Invalid token');
      }

      await this.redisService.client.expire(key, expiresIn); // Reset TTL
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
  user: Payload & {
    iat: number;
    exp: number;
  };
}
