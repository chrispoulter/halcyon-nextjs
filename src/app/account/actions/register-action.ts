'use server';

import { z } from 'zod';
import type { RegisterResponse } from '@/app/account/account-types';
import { ServerActionResult } from '@/lib/action-types';
import { apiClient } from '@/lib/api-client';
import { isInPast } from '@/lib/dates';

const schema = z
    .object({
        emailAddress: z
            .string({ message: 'Email Address must be a valid string' })
            .email('Email Address must be a valid email'),
        password: z
            .string({ message: 'Password must be a valid string' })
            .min(8, 'Password must be at least 8 characters')
            .max(50, 'Password must be no more than 50 characters'),
        confirmPassword: z
            .string({ message: 'Confirm Password must be a valid string' })
            .min(1, 'Confirm Password is a required field'),
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
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

type RegisterActionValues = z.infer<typeof schema>;

export async function registerAction(
    input: RegisterActionValues
): Promise<ServerActionResult<RegisterResponse>> {
    const parsedInput = await schema.safeParseAsync(input);

    if (!parsedInput.success) {
        return {
            validationErrors: parsedInput.error.flatten(),
        };
    }

    return await apiClient.post<RegisterResponse>(
        '/account/register',
        parsedInput.data
    );
}
