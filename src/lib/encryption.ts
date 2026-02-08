import crypto from 'crypto';
import { config } from '@/lib/config';

const ALGORITHM = 'aes-256-gcm';
const NONCE_SIZE = 12;
const TAG_SIZE = 16;

const ENCRYPTION_KEY = Buffer.from(config.ENCRYPTION_KEY, 'base64');

export function encryptSecret(text: string): string {
    const iv = crypto.randomBytes(NONCE_SIZE);
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

    const encrypted = Buffer.concat([
        cipher.update(text, 'utf8'),
        cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return Buffer.concat([iv, authTag, encrypted]).toString('base64');
}

export function decryptSecret(cipherText: string): string {
    const data = Buffer.from(cipherText, 'base64');

    const iv = data.subarray(0, NONCE_SIZE);
    const authTag = data.subarray(NONCE_SIZE, NONCE_SIZE + TAG_SIZE);
    const encrypted = data.subarray(NONCE_SIZE + TAG_SIZE);

    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
    ]);

    return decrypted.toString('utf8');
}
