import { Controller, Get, Request, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from '../service/users.service';
import { FastifyRequestWithUser } from '../../../middleware/Authentication';
import { plainToClass } from 'class-transformer';
import { FastifyReply } from 'fastify';
import { ProfileTransform } from '../transform/profile.transform';

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
}
