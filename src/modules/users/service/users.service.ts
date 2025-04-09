import { UserDataService } from '@/common/data/user.service';
import { hashBcrypt } from '@/common/helpers/function';
import { Users } from '@/common/models/user.model';
import { PrismaService } from '@/common/prisma/prisma.service';
import { UserException } from '@/exceptions/UserException';
import { FastifyRequestWithUser } from '@/middleware/Authentication';
import { ChangePasswordDto } from '@/modules/users/dto/change-password.dto';
import { SignUpDto } from '@/modules/users/dto/signup.dto';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { User } from '@prisma/client';

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

  async signUp(dto: SignUpDto) {
    await Users().create({
      data: {
        email: dto.email,
        password: await hashBcrypt(dto.password),
        name: dto.name,
      },
    });
  }
}
