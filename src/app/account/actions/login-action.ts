'use server';

import { z } from 'zod';
import { decodeJwt } from 'jose';
import type { LoginResponse, TokenPayload } from '@/app/account/account-types';
import { apiClient } from '@/lib/api-client';
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

export const loginAction = actionClient
    .metadata({ actionName: 'loginAction' })
    .schema(schema)
    .action(async ({ parsedInput }) => {
        const result = await apiClient.post<LoginResponse>(
            '/account/login',
            parsedInput
        );

        const { accessToken } = result;

        const payload = decodeJwt<TokenPayload>(accessToken);

        await createSession({
            ...payload,
            accessToken,
            roles:
                typeof payload.roles === 'string'
                    ? [payload.roles]
                    : payload.roles || [],
        });
    });
