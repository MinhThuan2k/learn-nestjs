import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { get_env } from '../common/helpers/function';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    const APP_DEBUG = get_env('APP_DEBUG') === 'true';
    if (!APP_DEBUG) {
      return next();
    }
    console.log(
      'Incoming Request: ' +
        JSON.stringify({
          url: req.url,
          method: req.method,
          params: req.params,
          query: req.query,
          body: req.body,
          headers: JSON.stringify(req.headers),
          raw: JSON.stringify(req.raw),
        }) +
        '\n',
    );
    next();
  }
}
