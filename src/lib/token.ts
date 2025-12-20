import crypto from 'crypto';

export function hashToken(token: string) {
    return crypto.createHash('sha512').update(token).digest('hex');
}

export function verifyToken(token: string, hashedToken: string) {
    return hashedToken === hashToken(token);
}
