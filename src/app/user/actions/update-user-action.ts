'use server';

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import type { UpdateUserResponse } from '@/app/user/user-types';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { isInPast } from '@/lib/dates';
import { ActionError, authActionClient } from '@/lib/safe-action';
import { Role } from '@/lib/definitions';

const schema = z.object({
    id: z
        .string({ message: 'Id must be a valid string' })
        .uuid('Id must be a valid UUID'),
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
    roles: z
        .array(
            z.nativeEnum(Role, {
                message: 'Role must be a valid user role',
            }),
            { message: 'Role must be a valid array' }
        )
        .optional(),
    version: z.number({ message: 'Version must be a valid number' }).optional(),
});

const roles = [Role.SYSTEM_ADMINISTRATOR, Role.USER_ADMINISTRATOR];

export const updateUserAction = authActionClient(roles)
    .metadata({ actionName: 'updateUserAction' })
    .schema(schema)
    .action(async ({ parsedInput: { id, ...rest } }) => {
        const [user] = await db
            .select({
                id: users.id,
                emailAddress: users.emailAddress,
                // version: users.version
            })
            .from(users)
            .where(eq(users.id, id))
            .limit(1);

        if (!user) {
            throw new ActionError('User not found.', 404);
        }

        // TODO: Validate version
        if (!rest.version && rest.version !== rest.version) {
            throw new ActionError(
                'Data has been modified since entities were loaded.'
            );
        }

        if (
            rest.emailAddress.toLowerCase() !== user.emailAddress.toLowerCase()
        ) {
            const [existing] = await db
                .select({})
                .from(users)
                .where(eq(users.emailAddress, rest.emailAddress))
                .limit(1);

            if (existing) {
                throw new ActionError('User name is already taken.');
            }
        }

        await db.update(users).set(rest).where(eq(users.id, id));

        return { id: user.id } as UpdateUserResponse;
    });
