import { get_env } from '@/common/helpers/function';

export const host: string = get_env('REDIS_HOST');
export const port: number = +get_env('REDIS_PORT');
export const prefix: string = get_env('REDIS_PREFIX');
export const prefixUser: string = get_env('REDIS_PREFIX_USER');
export const secretKey: string = get_env('REDIS_SECRET');
