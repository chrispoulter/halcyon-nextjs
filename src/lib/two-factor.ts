import 'server-only';

import { TOTP } from 'otpauth';
import { randomBytes } from 'crypto';
import { config } from '@/lib/config';
import { generateHash } from '@/lib/hash';

const issuer = config.TWO_FACTOR_ISSUER;

export function generateSecret(label: string) {
    const totp = new TOTP({ issuer, label });

    return {
        base32: totp.secret.base32,
        otpauth: totp.toString(),
    };
}

export function generateOtpauth(secret: string, label: string) {
    return new TOTP({ issuer, label, secret }).toString();
}

export function verifySecret(secret: string, label: string, token: string) {
    return new TOTP({ issuer, label, secret }).validate({ token });
}

export async function generateRecoveryCodes(count = 10) {
    const recoveryCodes = Array.from({ length: count }, () =>
        randomBytes(5).toString('hex').toUpperCase()
    );

    const hashedRecoveryCodes = await Promise.all(
        recoveryCodes.map(generateHash)
    );

    return { recoveryCodes, hashedRecoveryCodes };
}
