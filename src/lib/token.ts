import { createHash, timingSafeEqual } from 'crypto';

export function hashToken(token: string) {
    return createHash('sha512').update(token).digest('hex');
}

export function verifyToken(token: string, hashedToken: string) {
    const actual = createHash('sha512').update(token).digest();
    const expected = Buffer.from(hashedToken, 'hex');
    return timingSafeEqual(actual, expected);
}
