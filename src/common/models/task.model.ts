import { prismaSingleton } from '@/common/models/base.model';
import { PrismaClient } from '@prisma/client';

export default function Tasks(
  prismaTask: PrismaClient['tasks'] = prismaSingleton.tasks,
) {
  const ObjFuc = {};

  return ObjFuc && Object.assign(prismaTask, ObjFuc);
}
