import CryptoJS from 'crypto-js';
import bcrypt from 'bcryptjs';

export const get_env = (key: string, defaultValue: string = null) => {
  return process.env[key] || defaultValue;
};

export const hashBcrypt = async (
  text: string,
  length: number = 10,
): Promise<string> => await bcrypt.hash(text, length);

export const compareBcrypt = async (
  text: string,
  hash: string,
): Promise<boolean> => await bcrypt.compare(text, hash);

export const encrypt = (text: string): string =>
  CryptoJS.AES.encrypt(text).toString();

export const decrypt = (text: any) => {
  const bytes = CryptoJS.AES.decrypt(text);
  return bytes.toString(CryptoJS.enc.Utf8);
};
