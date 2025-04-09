import { HttpException } from '@nestjs/common';

export class UserException extends HttpException {
  constructor(message: string, status: number = 400) {
    super({ message, status }, status);
    this.name = 'UserException';
  }
}
