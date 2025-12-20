import bcrypt from 'bcrypt';

const ROUNDS = 10;

export function hashPassword(password: string) {
    return bcrypt.hash(password, ROUNDS);
}

export function verifyPassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
}
