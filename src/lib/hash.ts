import crypto from 'crypto';

export function generateHash(str: string) {
    return crypto.createHash('sha512').update(str).digest('hex');
}

export function verifyHash(str: string, hash: string) {
    return hash === crypto.createHash('sha512').update(str).digest('hex');
}
