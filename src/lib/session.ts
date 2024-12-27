import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { forbidden, redirect } from 'next/navigation';
import { SignJWT, jwtVerify } from 'jose';
import { config } from '@/lib/config';
import type { Role, SessionPayload } from '@/lib/session-types';

const secretKey = config.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

async function encrypt(payload: SessionPayload, expiresAt: Date) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresAt)
        .sign(encodedKey);
}

async function decrypt(
    session: string | undefined = ''
): Promise<SessionPayload | undefined> {
    try {
        const { payload } = await jwtVerify<SessionPayload>(
            session,
            encodedKey,
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
    const expiresAt = new Date(Date.now() + config.SESSION_EXPIRES_IN * 1000);
    const session = await encrypt(payload, expiresAt);
    const cookieStore = await cookies();

    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}

export const getSession = cache(async () => {
    const cookie = (await cookies()).get('session')?.value;
    return await decrypt(cookie);
});

export const verifySession = cache(async (roles?: Role[]) => {
    const session = await getSession();

    if (!session) {
        return redirect('/account/login?vs=1');
    }

    if (!roles) {
        return session;
    }

    if (!roles.some((value) => session.roles?.includes(value))) {
        return forbidden();
    }

    return session;
});
