import argon2 from 'argon2';

export function generateHash(value: string) {
    return argon2.hash(value);
}

export function verifyHash(value: string, hash: string) {
    return argon2.verify(hash, value);
}
