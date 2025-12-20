import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto';

const ALGORITHM = 'sha256';
const SALT_SIZE = 16;
const KEY_SIZE = 32;
const ITERATIONS = 10000;

export function generateHash(value: string) {
    const salt = randomBytes(SALT_SIZE);
    const key = pbkdf2Sync(value, salt, ITERATIONS, KEY_SIZE, ALGORITHM);

    const saltBase64 = salt.toString('base64');
    const keyBase64 = key.toString('base64');

    return `${saltBase64}.${keyBase64}`;
}

export function verifyHash(value: string, hash: string) {
    const parts = hash.split('.', 2);

    if (parts.length !== 2) {
        return false;
    }

    const salt = Buffer.from(parts[0], 'base64');
    const key = Buffer.from(parts[1], 'base64');

    const keyToCheck = pbkdf2Sync(value, salt, ITERATIONS, KEY_SIZE, ALGORITHM);

    return timingSafeEqual(key, keyToCheck);
}
