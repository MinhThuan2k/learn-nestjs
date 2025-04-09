import { prismaSingleton } from '@/common/models/base.model';
import { PrismaClient } from '@prisma/client';

export const Users = function (
  prismaUser: PrismaClient['user'] = prismaSingleton.user,
) {
  return Object.assign(prismaUser, {
    /**
     * Add new function
     */

    signUp() {
      console.log('sign up');
    },
  });
};
