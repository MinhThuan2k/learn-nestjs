import { get_env } from '../common/helpers/function';

export const jwtSecret = get_env('JWT_SECRET');

export const expiresIn: number = 60 * 60 * 24 * 7; // 7 days

export const signOptions = { expiresIn };

export const isMultipleDevice = true;
