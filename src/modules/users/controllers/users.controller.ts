import { Body, Controller, Get, Post, Request, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from '../service/users.service';
import { FastifyRequestWithUser } from '../../../middleware/Authentication';
import { plainToClass } from 'class-transformer';
import { FastifyReply } from 'fastify';
import { ProfileTransform } from '../transform/profile.transform';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ValidationPipe } from '../../../common/validations/ValidationPipe';
import { SignUpDto } from '../dto/signup.dto';
import { NoAuth } from '../../../middleware/NoAuth';

@ApiTags('Users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(
    @Request() req: FastifyRequestWithUser,
    @Res() res: FastifyReply,
  ) {
    const profile = await this.usersService.getProfile(req);
    const result = plainToClass(ProfileTransform, profile, {
      excludeExtraneousValues: true,
    });
    return res.send(result);
  }

  @Post('change-password')
  async changePassword(
    @Body(new ValidationPipe()) req: ChangePasswordDto,
    @Res() res: FastifyReply,
  ) {
    this.usersService.changePassword(req);
    return res.send({ message: 'Changed password successfully' });
  }

  @Post('sign-up')
  @NoAuth()
  async signUp(
    @Body(new ValidationPipe()) req: SignUpDto,
    @Res() res: FastifyReply,
  ) {
    this.usersService.signUp(req);
    return res.send({ message: 'Create user successfully' });
  }
}
