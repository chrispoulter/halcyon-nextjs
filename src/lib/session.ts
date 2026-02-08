import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { JWTPayload, SignJWT, jwtVerify } from 'jose';
import { config } from '@/lib/config';
import type { PendingSessionPayload, SessionPayload } from '@/lib/definitions';

const SESSION_COOKIE = 'session';
const PENDING_SESSION_COOKIE = 'pending_session';
const ENCODED_SESSION_SECRET = new TextEncoder().encode(config.SESSION_SECRET);

async function encrypt(payload: JWTPayload, expires: Date) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expires)
        .sign(ENCODED_SESSION_SECRET);
}

async function decrypt<T>(value = ''): Promise<T | undefined> {
    try {
        const { payload } = await jwtVerify<T>(value, ENCODED_SESSION_SECRET, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch {
        console.log('Failed to verify session');
    }
}

export async function createSession(payload: SessionPayload) {
    const expires = new Date(Date.now() + config.SESSION_DURATION * 1000);
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
    return await decrypt<SessionPayload>(cookie?.value);
});

export async function createPendingSession(payload: PendingSessionPayload) {
    const expires = new Date(Date.now() + 10 * 60 * 1000);
    const cookieStore = await cookies();
    const session = await encrypt(payload, expires);

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
    return await decrypt<PendingSessionPayload>(cookie?.value);
});
