'use server';

import { createSession } from '@/lib/session';
import { trace } from '@opentelemetry/api';
import { jwtVerify } from 'jose';
import { z } from 'zod';

const actionSchema = z.object({
    emailAddress: z
        .string({ message: 'Email Address must be a valid string' })
        .min(1, 'Email Address is a required field')
        .email('Email Address must be a valid email'),
    password: z
        .string({ message: 'Password must be a valid string' })
        .min(1, 'Password is a required field'),
});

export type LoginResponse = {
    accessToken: string;
};

type JwtPayload = {
    sub: string;
    email: string;
    given_name: string;
    family_name: string;
    roles: string | string[];
};

const securityKey = process.env.JWT_SECURITY_KEY;
const encodedSecurityKey = new TextEncoder().encode(securityKey);

export async function loginAction(data: unknown) {
    return await trace
        .getTracer('halcyon-web')
        .startActiveSpan('loginAction', async (span) => {
            try {
                const request = actionSchema.safeParse(data);

                if (!request.success) {
                    return {
                        errors: request.error.flatten().fieldErrors,
                    };
                }

                const response = await fetch(
                    `${process.env.services__api__https__0}/account/login`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(request.data),
                    }
                );

                if (!response.ok) {
                    return {
                        errors: [
                            'An error occurred while processing your request',
                        ],
                    };
                }

                const result = (await response.json()) as LoginResponse;

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
            } finally {
                span.end();
            }
        });
}
