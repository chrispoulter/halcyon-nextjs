import bcrypt from 'bcryptjs';

export const hashPassword = (password: string) => bcrypt.hash(password, 10);

export const verifyPassword = (password: string, hashedPassword: string) =>
    bcrypt.compare(password, hashedPassword);
