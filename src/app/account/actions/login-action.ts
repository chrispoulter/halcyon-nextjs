'use server';

import { z } from 'zod';
import { jwtVerify } from 'jose';
import {
    LoginResponse,
    JwtPayload,
} from '@/app/account/actions/account-definitions';
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

const securityKey = process.env.JWT_SECURITY_KEY;
const encodedSecurityKey = new TextEncoder().encode(securityKey);

export const loginAction = actionClient
    .schema(schema)
    .action(async ({ parsedInput }) => {
        const response = await fetch(`${process.env.API_URL}/account/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parsedInput),
        });

        if (!response.ok) {
            throw new Error('An error occurred while processing your request');
        }

        const result: LoginResponse = await response.json();

        const { payload } = await jwtVerify<JwtPayload>(
            result.accessToken,
            encodedSecurityKey,
            {
                audience: process.env.JWT_AUDIENCE,
                issuer: process.env.JWT_ISSUER,
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

        return result;
    });
