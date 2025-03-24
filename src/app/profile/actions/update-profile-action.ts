'use server';

import { z } from 'zod';
import { eq, sql } from 'drizzle-orm';
import type { UpdateProfileResponse } from '@/app/profile/profile-types';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { isInPast } from '@/lib/dates';
import { ActionError, authActionClient } from '@/lib/safe-action';

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
    version: z.number({ message: 'Version must be a valid number' }).optional(),
});

export const updateProfileAction = authActionClient()
    .metadata({ actionName: 'updateProfileAction' })
    .schema(schema)
    .action(async ({ parsedInput, ctx: { userId } }) => {
        const [user] = await db
            .select({
                id: users.id,
                emailAddress: users.emailAddress,
                isLockedOut: users.isLockedOut,
                version: sql<number>`"xmin"`.mapWith(Number),
            })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        if (!user || user.isLockedOut) {
            throw new ActionError('User not found.', 404);
        }

        if (!parsedInput.version && parsedInput.version !== user.version) {
            throw new ActionError(
                'Data has been modified since entities were loaded.'
            );
        }

        if (
            parsedInput.emailAddress.toLowerCase() !==
            user.emailAddress.toLowerCase()
        ) {
            const [existing] = await db
                .select({})
                .from(users)
                .where(eq(users.emailAddress, parsedInput.emailAddress))
                .limit(1);

            if (existing) {
                throw new ActionError('User name is already taken.');
            }
        }

        await db.update(users).set(parsedInput).where(eq(users.id, userId));

        return { id: user.id } as UpdateProfileResponse;
    });
