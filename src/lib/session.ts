import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { config } from '@/lib/config';
import type { PendingSessionPayload, SessionPayload } from '@/lib/definitions';

const SESSION_COOKIE = 'session';
const PENDING_SESSION_COOKIE = 'pending_session';

const sessionDuration = config.SESSION_DURATION;
const sessionSecret = config.SESSION_SECRET;
const encodedSecret = new TextEncoder().encode(sessionSecret);

async function encrypt(payload: SessionPayload, expires: Date) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expires)
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
    const expires = new Date(Date.now() + sessionDuration * 1000);
    const cookieStore = await cookies();
    const session = await encrypt(payload, expires);

    cookieStore.set(SESSION_COOKIE, session, {
        httpOnly: true,
        secure: true,
        expires,
        sameSite: 'lax',
        path: '/',
    });
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
}

export const getSession = cache(async () => {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(SESSION_COOKIE);
    return await decrypt(cookie?.value);
});

export async function createPendingSession(payload: PendingSessionPayload) {
    const expires = new Date(Date.now() + 10 * 60 * 1000);
    const cookieStore = await cookies();
    const session = await encrypt(
        payload as unknown as SessionPayload,
        expires
    );

    cookieStore.set(PENDING_SESSION_COOKIE, session, {
        httpOnly: true,
        secure: true,
        expires,
        sameSite: 'lax',
        path: '/',
    });
}

export async function deletePendingSession() {
    const cookieStore = await cookies();
    cookieStore.delete(PENDING_SESSION_COOKIE);
}

export const getPendingSession = cache(async () => {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(PENDING_SESSION_COOKIE);
    return await decrypt(cookie?.value);
});
