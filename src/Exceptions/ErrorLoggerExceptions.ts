import {
  ExceptionFilter,
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import * as fs from 'fs-extra';
import * as path from 'path';
import { UserException } from './UserException';
import { get_env } from '../common/helpers/function';
import { JsonWebTokenError } from '@nestjs/jwt';
import { ValidationException } from '../common/validations/ValidateException';

@Catch()
export class ErrorLoggerExceptions implements ExceptionFilter {
  useLogging: boolean;

  constructor(useLogging = get_env('LOG_ENABLED') === 'true') {
    this.useLogging = useLogging;
  }

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest();

    let status = 500;
    let exceptionResponse: any = {
      message: 'Internal server error',
      statusCode: status,
    };

    // Extend from HttpException
    const handledNoReportExceptions = [UserException, ValidationException];

    if (handledNoReportExceptions.some((ex) => exception instanceof ex)) {
      return response
        .status(exception.getStatus())
        .send(exception.getResponse());
    }

    if (exception instanceof JsonWebTokenError) {
      return response.status(HttpStatus.UNAUTHORIZED).send({
        message: exception.message,
        status: status || 500,
      });
    }

    const APP_DEBUG = get_env('APP_DEBUG') === 'true';
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as {
        message: string | string[];
        statusCode: number;
      };
      exceptionResponse = { message: res.message, statusCode: status };
    } else if (exception instanceof Error) {
      exceptionResponse = {
        message: exception.message,
        status: status || 500,
      };
    }

    if (APP_DEBUG) {
      exceptionResponse.error = exception.name;
      exceptionResponse.stack =
        (exception.stack &&
          exception.stack.split('\n').map((line) => line.trim())) ||
        'No stack trace';
    }

    if (!this.useLogging || process.env.NODE_ENV === 'local') {
      return response.status(status).send(exceptionResponse);
    }

    const timestamp = new Date().toISOString();
    const logData = {
      url: request.url,
      method: request.method,
      params: request.params,
      query: request.query,
      body: request.body,
      headers: request.headers,
      error: exceptionResponse,
      stack: exception.stack,
    };

    const logsDir = path.join(__dirname, '../../logs');
    const logFileName = `error-${new Date().toISOString().split('T')[0]}.log`;
    const logFilePath = path.join(logsDir, logFileName);
    await fs.ensureDir(logsDir);

    const logString = logData ? JSON.stringify(logData) : '';
    if (logString) {
      await fs.appendFile(
        logFilePath,
        `====Start Request Error At Time: ${timestamp}\n\t ${logString}\n====End Request Error\n`,
      );
    }

    response.status(status).send(exceptionResponse);
  }
}
