import 'server-only';

import { TOTP } from 'otpauth';
import { randomBytes } from 'crypto';
import { config } from '@/lib/config';
import { generateHash } from '@/lib/hash';

export function generateSecret(label: string) {
    const totp = new TOTP({ issuer: config.TWO_FACTOR_ISSUER, label });

    return {
        base32: totp.secret.base32,
        otpauth: totp.toString(),
    };
}

export function generateOtpauth(secret: string, label: string) {
    const totp = new TOTP({ issuer: config.TWO_FACTOR_ISSUER, label, secret });
    return totp.toString();
}

export function verifySecret(secret: string, token: string) {
    const totp = new TOTP({ issuer: config.TWO_FACTOR_ISSUER, secret });
    return totp.validate({ token }) !== null;
}

export function generateRecoveryCodes(count = 10) {
    const recoveryCodes = Array.from({ length: count }, () =>
        randomBytes(5).toString('hex').toUpperCase()
    );

    const hashedRecoveryCodes = recoveryCodes.map(generateHash);

    return { recoveryCodes, hashedRecoveryCodes };
}
