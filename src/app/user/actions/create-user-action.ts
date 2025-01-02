'use server';

import { z } from 'zod';
import { CreateUserResponse } from '@/app/user/user-types';
import { ServerActionResult } from '@/lib/action-types';
import { apiClient } from '@/lib/api-client';
import { isInPast } from '@/lib/dates';
import { verifySession } from '@/lib/session';
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

type CreateUserActionValues = z.infer<typeof schema>;

export async function createUserAction(
    input: CreateUserActionValues
): Promise<ServerActionResult<CreateUserResponse>> {
    const { accessToken } = await verifySession([
        Role.SYSTEM_ADMINISTRATOR,
        Role.USER_ADMINISTRATOR,
    ]);

    const parsedInput = await schema.safeParseAsync(input);

    if (!parsedInput.success) {
        return {
            validationErrors: parsedInput.error.flatten(),
        };
    }

    return await apiClient.post<CreateUserResponse>('/user', parsedInput.data, {
        Authorization: `Bearer ${accessToken}`,
    });
}
