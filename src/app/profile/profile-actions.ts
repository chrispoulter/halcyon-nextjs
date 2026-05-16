'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { isInPast } from '@/lib/dates';
import { generateHash, verifyHash } from '@/lib/hash';
import { ActionError, authActionClient } from '@/lib/safe-action';
import { deleteSession } from '@/lib/session';

const updateProfileSchema = z.object({
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
});

type UpdateProfileResponse = {
    id: string;
};

export const updateProfileAction = authActionClient()
    .metadata({ actionName: 'updateProfileAction' })
    .inputSchema(updateProfileSchema)
    .action<UpdateProfileResponse>(async ({ parsedInput, ctx: { userId } }) => {
        const [user] = await db
            .select({
                id: users.id,
                normalizedEmailAddress: users.normalizedEmailAddress,
                isLockedOut: users.isLockedOut,
            })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        if (!user || user.isLockedOut) {
            throw new ActionError('User not found.', 404);
        }

        const normalizedEmailAddress = parsedInput.emailAddress.toLowerCase();

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

        await db.update(users).set(parsedInput).where(eq(users.id, userId));

        revalidatePath('/users');
        revalidatePath(`/users/${user.id}`);
        revalidatePath('/profile');

        return { id: user.id };
    });

const changePasswordSchema = z.object({
    currentPassword: z
        .string({ message: 'Current Password must be a valid string' })
        .min(1, 'Current Password is a required field'),
    newPassword: z
        .string({ message: 'New Password must be a valid string' })
        .min(8, 'New Password must be at least 8 characters')
        .max(50, 'New Password must be no more than 50 characters'),
});

type ChangePasswordResponse = {
    id: string;
};

export const changePasswordAction = authActionClient()
    .metadata({ actionName: 'changePasswordAction' })
    .inputSchema(changePasswordSchema)
    .action<ChangePasswordResponse>(
        async ({ parsedInput, ctx: { userId } }) => {
            const [user] = await db
                .select({
                    id: users.id,
                    password: users.password,
                    isLockedOut: users.isLockedOut,
                })
                .from(users)
                .where(eq(users.id, userId))
                .limit(1);

            if (!user || user.isLockedOut) {
                throw new ActionError('User not found.', 404);
            }

            if (!user.password) {
                throw new ActionError('Incorrect password.');
            }

            const verified = verifyHash(
                parsedInput.currentPassword,
                user.password
            );

            if (!verified) {
                throw new ActionError('Incorrect password.');
            }

            const password = generateHash(parsedInput.newPassword);

            await db
                .update(users)
                .set({
                    password,
                    passwordResetToken: null,
                })
                .where(eq(users.id, userId));

            revalidatePath('/users');
            revalidatePath(`/users/${user.id}`);
            revalidatePath('/profile');

            return { id: user.id };
        }
    );

type DeleteAccountResponse = {
    id: string;
};

export const deleteAccountAction = authActionClient()
    .metadata({ actionName: 'deleteAccountAction' })
    .action<DeleteAccountResponse>(async ({ ctx: { userId } }) => {
        const [user] = await db
            .select({
                id: users.id,
                isLockedOut: users.isLockedOut,
            })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        if (!user || user.isLockedOut) {
            throw new ActionError('User not found.', 404);
        }

        await db.delete(users).where(eq(users.id, userId));

        await deleteSession();

        // TODO: revalidatePath revalidates all paths. Uncomment when fixed.
        // revalidatePath('/users');

        return { id: user.id };
    });
