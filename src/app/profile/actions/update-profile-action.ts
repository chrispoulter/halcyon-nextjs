'use server';

import { z } from 'zod';
import type { UpdateProfileResponse } from '@/app/profile/profile-types';
import { ServerActionResult } from '@/lib/action-types';
import { apiClient } from '@/lib/api-client';
import { isInPast } from '@/lib/dates';
import { verifySession } from '@/lib/session';

const schema = z.object({
    emailAddress: z
        .string({ message: 'Email Address must be a valid string' })
        .email('Email Address must be a valid email'),
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
    version: z.string({ message: 'Version must be a valid string' }).optional(),
});

type UpdateProfileActionValues = z.infer<typeof schema>;

export async function updateProfileAction(
    input: UpdateProfileActionValues
): Promise<ServerActionResult<UpdateProfileResponse>> {
    const { accessToken } = await verifySession();

    const parsedInput = await schema.safeParseAsync(input);

    if (!parsedInput.success) {
        return {
            validationErrors: parsedInput.error.flatten(),
        };
    }

    return await apiClient.put<UpdateProfileResponse>(
        '/profile',
        parsedInput.data,
        {
            Authorization: `Bearer ${accessToken}`,
        }
    );
}
