import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { User } from '@prisma/client';
import { FastifyRequestWithUser } from '../../../middleware/Authentication';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { UserDataService } from '../../../common/data/user.service';
import { REQUEST } from '@nestjs/core';
import { UserException } from '../../../exceptions/UserException';
import { hashBcrypt } from '../../../common/helpers/function';
import { Users } from '../../../common/models/user.model';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userDataService: UserDataService,
    @Inject(REQUEST)
    private readonly request: FastifyRequestWithUser,
  ) {}

  /**
   * Retrieves user information based on the provided user ID.
   * @param {FastifyRequest} request
   * @returns {Promise<User | null>} The user data if found, otherwise null.
   */
  async getProfile(request: FastifyRequestWithUser): Promise<User | null> {
    const user = await Users().findFirst({
      where: {
        id: request.user.sub,
      },
    });
    return user;
  }

  async changePassword(dto: ChangePasswordDto) {
    const { user } = this.request;

    await this.prisma.user
      .update({
        where: { id: user.id },
        data: {
          password_changed_at: new Date(),
          password: await hashBcrypt(dto.password),
        },
        select: { id: true },
      })
      .catch(() => {
        throw new UserException('User not found');
      });
  }
}
