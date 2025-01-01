'use server';

import { forbidden, redirect } from 'next/navigation';
import { z } from 'zod';
import { CreateUserResponse } from '@/app/user/user-types';
import { config } from '@/lib/config';
import { isInPast } from '@/lib/dates';
import { authActionClient } from '@/lib/safe-action';
import { deleteSession } from '@/lib/session';
import { Role } from '@/lib/session-types';

const schema = z.object({
    emailAddress: z
        .string({ message: 'Email Address must be a valid string' })
        .email('Email Address must be a valid email'),
    password: z
        .string({ message: 'Password must be a valid string' })
        .min(8, 'Password must be at least 8 characters')
        .max(50, 'Password must be no more than 50 characters'),
    firstName: z
        .string({ message: 'First Name must be a valid string' })
        .min(1, 'First Name is a required field')
        .max(50, 'First Name must be no more than 50 characters'),
    lastName: z
        .string({ message: 'Last Name must be a valid string' })
        .min(1, 'Last Name is a required field')
        .max(50, 'Last Name must be no more than 50 characters'),
    dateOfBirth: z
        .string({
            message: 'Date of Birth must be a valid string',
        })
        .date('Date Of Birth must be a valid date')
        .refine(isInPast, { message: 'Date Of Birth must be in the past' }),
    roles: z
        .array(
            z.nativeEnum(Role, { message: 'Role must be a valid user role' }),
            { message: 'Role must be a valid array' }
        )
        .optional(),
    version: z.string({ message: 'Version must be a valid string' }).optional(),
});

export const createUserAction = authActionClient([
    Role.SYSTEM_ADMINISTRATOR,
    Role.USER_ADMINISTRATOR,
])
    .schema(schema)
    .action(async ({ parsedInput, ctx: { accessToken } }) => {
        const response = await fetch(`${config.API_URL}/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(parsedInput),
        });

        if (!response.ok) {
            switch (response.status) {
                case 401:
                    await deleteSession();
                    return redirect('/account/login');

                case 403:
                    return forbidden();

                default:
                    throw new Error(
                        `HTTP ${response.status} ${response.statusText}`
                    );
            }
        }

        return (await response.json()) as CreateUserResponse;
    });
