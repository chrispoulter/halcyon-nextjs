'use server';

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import type { RegisterResponse } from '@/app/account/account-types';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { isInPast } from '@/lib/dates';
import { generateHash } from '@/lib/hash';
import { actionClient, ActionError } from '@/lib/safe-action';

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
        .refine(isInPast, {
            message: 'Date Of Birth must be in the past',
        }),
});

export const registerAction = actionClient
    .metadata({ actionName: 'registerAction' })
    .schema(schema)
    .action(async ({ parsedInput }) => {
        const [existing] = await db
            .select({})
            .from(users)
            .where(eq(users.emailAddress, parsedInput.emailAddress))
            .limit(1);

        if (existing) {
            throw new ActionError('User name is already taken.');
        }

        const password = generateHash(parsedInput.password);

        const [user] = await db
            .insert(users)
            .values({ ...parsedInput, password })
            .returning({ id: users.id });

        return { id: user.id } as RegisterResponse;
    });
