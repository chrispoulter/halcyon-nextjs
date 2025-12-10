import 'server-only';

import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { config } from '@/lib/config';
import { generateHash } from '@/lib/hash';
import { randomBytes } from 'crypto';

export function generateTOTPSecret(email: string) {
    const issuer = config.APP_NAME;

    const secret = speakeasy.generateSecret({
        length: 20,
        name: `${issuer}:${email}`,
        issuer,
        otpauth_url: true,
    });

    return {
        base32: secret.base32,
        otpauth: secret.otpauth_url,
    };
}

export function generateQRCodeDataUrl(otpauthUrl: string) {
    return QRCode.toDataURL(otpauthUrl);
}

export function verifyTOTP(base32secret: string, token: string) {
    return speakeasy.totp.verify({
        secret: base32secret,
        encoding: 'base32',
        window: 1,
        token,
    });
}

export function generateRecoveryCodes(count = 10) {
    return Array.from({ length: count }, () =>
        randomBytes(5).toString('hex').toUpperCase()
    );
}

export function hashRecoveryCodes(codes: string[]) {
    return Promise.all(codes.map(generateHash));
}
