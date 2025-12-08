import bcrypt from 'bcrypt';

const ROUNDS = 10;

export function generateHash(str: string) {
    return bcrypt.hash(str, ROUNDS);
}

export function verifyHash(str: string, hash: string) {
    return bcrypt.compare(str, hash);
}
