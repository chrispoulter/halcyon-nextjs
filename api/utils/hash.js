import bcrypt from 'bcryptjs';

export const generateHash = str => bcrypt.hash(str, 10);

export const verifyHash = (str, hash) => bcrypt.compare(str, hash);