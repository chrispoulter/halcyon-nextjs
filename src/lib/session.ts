import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { config } from '@/lib/config';
import type { SessionPayload } from '@/lib/session-types';

const sessionSecret = config.SESSION_SECRET;
const encodedSecret = new TextEncoder().encode(sessionSecret);

async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(payload.exp)
        .sign(encodedSecret);
}

async function decrypt(value = ''): Promise<SessionPayload | undefined> {
    try {
        const { payload } = await jwtVerify<SessionPayload>(
            value,
            encodedSecret,
            {
                algorithms: ['HS256'],
            }
        );
        return payload;
    } catch {
        console.log('Failed to verify session');
    }
}

export async function createSession(payload: SessionPayload) {
    const cookieStore = await cookies();
    const session = await encrypt(payload);
    const expires = new Date(payload.exp * 1000);

    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        expires,
        sameSite: 'lax',
        path: '/',
    });
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}

export const getSession = cache(async () => {
    const cookieStore = await cookies();
    const cookie = cookieStore.get('session');
    return await decrypt(cookie?.value);
});
