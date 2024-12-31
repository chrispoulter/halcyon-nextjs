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
const encodedSecurityKey = new TextEncoder().encode(securityKey);

export const loginAction = actionClient
    .schema(schema)
    .action(async ({ parsedInput }) => {
        const result = await apiClient.post<LoginResponse>(
            '/account/login',
            parsedInput
        );

        //TODO: Handle 404 response
        if (!result) {
            throw new Error('Invalid response from server');
        }

        const { payload } = await jwtVerify<TokenPayload>(
            result.accessToken,
            encodedSecurityKey,
            {
                audience: config.JWT_AUDIENCE,
                issuer: config.JWT_ISSUER,
            }
        );

        await createSession({
            accessToken: result.accessToken,
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
