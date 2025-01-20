'use server';

import { z } from 'zod';
import { jwtVerify } from 'jose';
import type { LoginResponse, TokenPayload } from '@/app/account/account-types';
import { apiClient } from '@/lib/api-client';
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
const encodedKey = new TextEncoder().encode(securityKey);

export const loginAction = actionClient
    .metadata({ actionName: 'loginAction' })
    .schema(schema)
    .action(async ({ parsedInput }) => {
        const result = await apiClient.post<LoginResponse>(
            '/account/login',
            parsedInput
        );

        const { accessToken } = result;

        const { payload } = await jwtVerify<TokenPayload>(
            accessToken,
            encodedKey,
            {
                audience: config.JWT_AUDIENCE,
                issuer: config.JWT_ISSUER,
            }
        );

        await createSession({
            ...payload,
            accessToken,
            roles:
                typeof payload.roles === 'string'
                    ? [payload.roles]
                    : payload.roles || [],
        });
    });
