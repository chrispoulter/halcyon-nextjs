import bcrypt from 'bcrypt';

const ROUNDS = 10;

export function generateHash(value: string) {
    return bcrypt.hash(value, ROUNDS);
}

export function verifyHash(value: string, hash: string) {
    return bcrypt.compare(value, hash);
}
