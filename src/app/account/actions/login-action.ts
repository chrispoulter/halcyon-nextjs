'use server';

import { z } from 'zod';
import { jwtVerify } from 'jose';
import type { LoginResponse, TokenPayload } from '@/app/account/account-types';
import { config } from '@/lib/config';
import { actionClient } from '@/lib/safe-action';
import { createSession } from '@/lib/session';

const schema = z.object({
    emailAddress: z
        .string({ message: 'Email Address must be a valid string' })
        .email('Email Address must be a valid email'),
    password: z
        .string({ message: 'Password must be a valid string' })
        .min(1, 'Password is a required field'),
});

const securityKey = config.JWT_SECURITY_KEY;
const encodedSecurityKey = new TextEncoder().encode(securityKey);

export const loginAction = actionClient
    .schema(schema)
    .action(async ({ parsedInput }) => {
        const response = await fetch(`${config.API_URL}/account/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parsedInput),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }

        const { accessToken } = (await response.json()) as LoginResponse;

        const { payload } = await jwtVerify<TokenPayload>(
            accessToken,
            encodedSecurityKey,
            {
                audience: config.JWT_AUDIENCE,
                issuer: config.JWT_ISSUER,
            }
        );

        await createSession({
            accessToken,
            id: payload.sub,
            emailAddress: payload.email,
            firstName: payload.given_name,
            lastName: payload.family_name,
            roles:
                typeof payload.roles === 'string'
                    ? [payload.roles]
                    : payload.roles || [],
        });
    });
