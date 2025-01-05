import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { forbidden, redirect } from 'next/navigation';
import { SignJWT, jwtVerify } from 'jose';
import { config } from '@/lib/config';
import type { Role, SessionPayload } from '@/lib/session-types';

const sessionSecret = config.SESSION_SECRET;
const encodedSecret = new TextEncoder().encode(sessionSecret);

async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(payload.expiresAt)
        .sign(encodedSecret);
}

async function decrypt(
    session: string | undefined = ''
): Promise<SessionPayload | undefined> {
    try {
        const { payload } = await jwtVerify<SessionPayload>(
            session,
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
    const expires = new Date(payload.expiresAt * 1000);
    const session = await encrypt(payload);
    const cookieStore = await cookies();

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
    const cookie = (await cookies()).get('session')?.value;
    return await decrypt(cookie);
});

export const verifySession = cache(async (roles?: Role[]) => {
    const session = await getSession();

    if (!session) {
        redirect('/account/login');
    }

    if (!roles) {
        return session;
    }

    if (!roles.some((value) => session.roles?.includes(value))) {
        forbidden();
    }

    return session;
});
