import { scrypt, randomBytes, timingSafeEqual } from 'crypto';

const keyLength = 32;

export const hashPassword = async (password: string) =>
    new Promise<string>((resolve, reject) => {
        const salt = randomBytes(16).toString('hex');

        scrypt(password, salt, keyLength, (err, derivedKey) => {
            if (err) {
                reject(err);
            }

            resolve(`${salt}.${derivedKey.toString('hex')}`);
        });
    });

export const verifyPassword = async (password: string, hash: string) =>
    new Promise<boolean>((resolve, reject) => {
        const [salt, hashKey] = hash.split('.');
        const hashKeyBuff = Buffer.from(hashKey, 'hex');

        scrypt(password, salt, keyLength, (err, derivedKey) => {
            if (err) {
                reject(err);
            }

            resolve(timingSafeEqual(hashKeyBuff, derivedKey));
        });
    });
