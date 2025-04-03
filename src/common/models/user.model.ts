import { PrismaClient } from '@prisma/client';
import { prismaSingleton } from './base.model';

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
