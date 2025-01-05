'use server';

import { z } from 'zod';
import { jwtVerify } from 'jose';
import type { LoginResponse, TokenPayload } from '@/app/account/account-types';
import { ServerActionResult } from '@/lib/action-types';
import { apiClient, isApiClientResultSuccess } from '@/lib/api-client';
import { config } from '@/lib/config';
import { createSession } from '@/lib/session';

const actionSchema = z.object({
    emailAddress: z
        .string({ message: 'Email Address must be a valid string' })
        .email('Email Address must be a valid email'),
    password: z
        .string({ message: 'Password must be a valid string' })
        .min(1, 'Password is a required field'),
});

type LoginActionValues = z.infer<typeof actionSchema>;

const securityKey = config.JWT_SECURITY_KEY;
const encodedKey = new TextEncoder().encode(securityKey);

export async function loginAction(
    input: LoginActionValues
): Promise<ServerActionResult> {
    const parsedInput = await actionSchema.safeParseAsync(input);

    if (!parsedInput.success) {
        return {
            validationErrors: parsedInput.error.flatten(),
        };
    }

    const result = await apiClient.post<LoginResponse>(
        '/account/login',
        parsedInput.data
    );

    if (!isApiClientResultSuccess(result)) {
        return { error: result.error };
    }

    const { accessToken } = result.data;

    const { payload } = await jwtVerify<TokenPayload>(accessToken, encodedKey, {
        audience: config.JWT_AUDIENCE,
        issuer: config.JWT_ISSUER,
    });

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
        expiresAt: payload.exp,
    });

    return {};
}
