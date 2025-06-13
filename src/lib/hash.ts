import crypto from 'crypto';

export const generateHash = (str: string) =>
    crypto.createHash('sha512').update(str).digest('hex');

export const verifyHash = (str: string, hash: string) =>
    hash === crypto.createHash('sha512').update(str).digest('hex');
