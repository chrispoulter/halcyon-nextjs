import bcrypt from 'bcryptjs';

export const generateHash = (str: string) => bcrypt.hash(str, 10);

export const verifyHash = (str: string, hash: string) =>
    bcrypt.compare(str, hash);
