'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { isInPast } from '@/lib/dates';
import { roles, isUserAdministrator } from '@/lib/types';
import { generateHash } from '@/lib/hash';
import { ActionError, authActionClient } from '@/lib/safe-action';

const createUserSchema = z.object({
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
});

type CreateUserResponse = {
    id: string;
};

export const createUserAction = authActionClient(isUserAdministrator)
    .metadata({ actionName: 'createUserAction' })
    .inputSchema(createUserSchema)
    .action<CreateUserResponse>(async ({ parsedInput }) => {
        const normalizedEmailAddress = parsedInput.emailAddress.toLowerCase();

        const [existing] = await db
            .select({})
            .from(users)
            .where(eq(users.normalizedEmailAddress, normalizedEmailAddress))
            .limit(1);

        if (existing) {
            throw new ActionError('User name is already taken.');
        }

        const password = generateHash(parsedInput.password);

        const [user] = await db
            .insert(users)
            .values({ ...parsedInput, password })
            .returning({ id: users.id });

        revalidatePath('/users');

        return { id: user.id };
    });

const updateUserSchema = z.object({
    id: z.uuid('Id must be a valid UUID'),
    emailAddress: z.email('Email Address must be a valid email'),
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
});

type UpdateUserResponse = {
    id: string;
};

export const updateUserAction = authActionClient(isUserAdministrator)
    .metadata({ actionName: 'updateUserAction' })
    .inputSchema(updateUserSchema)
    .action<UpdateUserResponse>(async ({ parsedInput: { id, ...rest } }) => {
        const [user] = await db
            .select({
                id: users.id,
                normalizedEmailAddress: users.normalizedEmailAddress,
            })
            .from(users)
            .where(eq(users.id, id))
            .limit(1);

        if (!user) {
            throw new ActionError('User not found.', 404);
        }

        const normalizedEmailAddress = rest.emailAddress.toLowerCase();

        if (normalizedEmailAddress !== user.normalizedEmailAddress) {
            const [existing] = await db
                .select({})
                .from(users)
                .where(eq(users.normalizedEmailAddress, normalizedEmailAddress))
                .limit(1);

            if (existing) {
                throw new ActionError('User name is already taken.');
            }
        }

        await db.update(users).set(rest).where(eq(users.id, id));

        revalidatePath('/users');
        revalidatePath(`/users/${user.id}`);
        revalidatePath('/profile');

        return { id: user.id };
    });

const deleteUserSchema = z.object({
    id: z.uuid('Id must be a valid UUID'),
});

type DeleteUserResponse = {
    id: string;
};

export const deleteUserAction = authActionClient(isUserAdministrator)
    .metadata({ actionName: 'deleteUserAction' })
    .inputSchema(deleteUserSchema)
    .action<DeleteUserResponse>(
        async ({ parsedInput: { id }, ctx: { userId } }) => {
            const [user] = await db
                .select({
                    id: users.id,
                })
                .from(users)
                .where(eq(users.id, id))
                .limit(1);

            if (!user) {
                throw new ActionError('User not found.', 404);
            }

            if (user.id === userId) {
                throw new ActionError(
                    'Cannot delete currently logged in user.'
                );
            }

            await db.delete(users).where(eq(users.id, user.id));

            // TODO: revalidatePath revalidates all paths. Uncomment when fixed.
            // revalidatePath('/users');

            return { id: user.id };
        }
    );

const lockUserSchema = z.object({
    id: z.uuid('Id must be a valid UUID'),
});

type LockUserResponse = {
    id: string;
};

export const lockUserAction = authActionClient(isUserAdministrator)
    .metadata({ actionName: 'lockUserAction' })
    .inputSchema(lockUserSchema)
    .action<LockUserResponse>(
        async ({ parsedInput: { id }, ctx: { userId } }) => {
            const [user] = await db
                .select({
                    id: users.id,
                })
                .from(users)
                .where(eq(users.id, id))
                .limit(1);

            if (!user) {
                throw new ActionError('User not found.', 404);
            }

            if (user.id === userId) {
                throw new ActionError('Cannot lock currently logged in user.');
            }

            await db
                .update(users)
                .set({ isLockedOut: true })
                .where(eq(users.id, user.id));

            revalidatePath('/users');
            revalidatePath(`/users/${user.id}`);
            revalidatePath('/profile');

            return { id: user.id };
        }
    );

const unlockUserSchema = z.object({
    id: z.uuid('Id must be a valid UUID'),
});

type UnlockUserResponse = {
    id: string;
};

export const unlockUserAction = authActionClient(isUserAdministrator)
    .metadata({ actionName: 'unlockUserAction' })
    .inputSchema(unlockUserSchema)
    .action<UnlockUserResponse>(async ({ parsedInput: { id } }) => {
        const [user] = await db
            .select({
                id: users.id,
            })
            .from(users)
            .where(eq(users.id, id))
            .limit(1);

        if (!user) {
            throw new ActionError('User not found.', 404);
        }

        await db
            .update(users)
            .set({ isLockedOut: false })
            .where(eq(users.id, user.id));

        revalidatePath('/users');
        revalidatePath(`/users/${user.id}`);
        revalidatePath('/profile');

        return { id: user.id };
    });
