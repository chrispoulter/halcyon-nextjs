'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import type { UpdateProfileResponse } from '@/app/profile/profile-types';
import { config } from '@/lib/config';
import { isInPast } from '@/lib/dates';
import { authActionClient } from '@/lib/safe-action';
import { deleteSession } from '@/lib/session';

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

export const updateProfileAction = authActionClient()
    .schema(schema)
    .action(async ({ parsedInput, ctx: { accessToken } }) => {
        const response = await fetch(`${config.API_URL}/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}INVALID`,
            },
            body: JSON.stringify(parsedInput),
        });

        if (!response.ok) {
            switch (response.status) {
                case 401:
                    await deleteSession();
                    redirect('/account/login');

                default:
                    throw new Error(
                        `HTTP ${response.status} ${response.statusText}`
                    );
            }
        }

        return (await response.json()) as UpdateProfileResponse;
    });
