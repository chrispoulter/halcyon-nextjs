'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import type { CreateUserResponse } from '@/app/user/user-types';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { isInPast } from '@/lib/dates';
import { roles, isUserAdministrator } from '@/lib/definitions';
import { generateHash } from '@/lib/hash';
import { ActionError, authActionClient } from '@/lib/safe-action';

const schema = z.object({
    emailAddress: z.email('Email Address must be a valid email'),
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
    dateOfBirth: z.iso
        .date('Date Of Birth must be a valid date')
        .refine(isInPast, { message: 'Date Of Birth must be in the past' }),
    roles: z
        .array(
            z.enum(roles, {
                message: 'Role must be a valid user role',
            }),
            { message: 'Role must be a valid array' }
        )
        .optional(),
    version: z.number({ message: 'Version must be a valid number' }).optional(),
});

export const createUserAction = authActionClient(isUserAdministrator)
    .metadata({ actionName: 'createUserAction' })
    .inputSchema(schema)
    .action<CreateUserResponse>(async ({ parsedInput }) => {
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

        revalidatePath('/user');

        return { id: user.id };
    });
