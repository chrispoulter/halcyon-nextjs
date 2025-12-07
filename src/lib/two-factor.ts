import 'server-only';

import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { config } from '@/lib/config';
import { generateHash } from '@/lib/hash';

export function generateTOTPSecret(email: string) {
    const issuer = config.APP_NAME ?? 'Halcyon';

    const secret = speakeasy.generateSecret({
        length: 20,
        name: `${issuer}:${email}`,
        issuer,
    });

    return {
        base32: secret.base32,
        otpauth: secret.otpauth_url!,
    };
}

export function generateQRCodeDataUrl(otpauthUrl: string) {
    return QRCode.toDataURL(otpauthUrl);
}

export function verifyTOTP(secretBase32: string, token: string) {
    return speakeasy.totp.verify({
        secret: secretBase32,
        encoding: 'base32',
        window: 1,
        token,
    });
}

export function generateRecoveryCodes(count = 10) {
    const codes: string[] = [];

    for (let i = 0; i < count; i++) {
        const raw = Array.from(crypto.getRandomValues(new Uint32Array(4)))
            .map((n) => n.toString(16).padStart(8, '0'))
            .join('')
            .slice(0, 20);

        codes.push(raw);
    }

    return codes;
}

export function hashRecoveryCodes(codes: string[]) {
    return codes.map((c) => generateHash(c));
}
