import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { User } from '@prisma/client';
import { FastifyRequestWithUser } from '../../../middleware/Authentication';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves user information based on the provided user ID.
   * @param {FastifyRequest} request
   * @returns {Promise<User | null>} The user data if found, otherwise null.
   */
  async getProfile(request: FastifyRequestWithUser): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: request.user.sub,
      },
    });
    return user;
  }
}
