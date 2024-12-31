'use server';

import { z } from 'zod';
import { jwtVerify } from 'jose';
import type {
    LoginResponse,
    ApiTokenPayload,
} from '@/app/account/account-types';
import { config } from '@/lib/config';
import { actionClient, ActionError } from '@/lib/safe-action';
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
            const error = response.headers
                .get('content-type')
                ?.includes('application/problem+json')
                ? await response.json()
                : await response.text();

            throw new ActionError(
                error?.title ||
                    error ||
                    `${response.status} ${response.statusText}`
            );
        }

        const { accessToken }: LoginResponse = await response.json();

        const { payload } = await jwtVerify<ApiTokenPayload>(
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
