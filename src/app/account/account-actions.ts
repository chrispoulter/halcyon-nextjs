'use server';

import { randomBytes } from 'crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { ResetPasswordEmail } from '@/emails/reset-password-email';
import { isInPast } from '@/lib/dates';
import { type Role } from '@/lib/definitions';
import { sendEmail } from '@/lib/email';
import { generateHash, verifyHash } from '@/lib/hash';
import { actionClient, ActionError } from '@/lib/safe-action';
import { createSession, deleteSession } from '@/lib/session';
import { getSiteUrl } from '@/lib/server-utils';

const loginSchema = z.object({
    emailAddress: z.email('Email Address must be a valid email'),
    password: z
        .string({ message: 'Password must be a valid string' })
        .min(1, 'Password is a required field'),
});

export const loginAction = actionClient
    .metadata({ actionName: 'loginAction' })
    .inputSchema(loginSchema)
    .action(async ({ parsedInput }) => {
        const normalizedEmailAddress = parsedInput.emailAddress.toLowerCase();

        const [user] = await db
            .select({
                id: users.id,
                emailAddress: users.emailAddress,
                password: users.password,
                firstName: users.firstName,
                lastName: users.lastName,
                isLockedOut: users.isLockedOut,
                roles: users.roles,
            })
            .from(users)
            .where(eq(users.normalizedEmailAddress, normalizedEmailAddress))
            .limit(1);

        if (!user || !user.password) {
            throw new ActionError('The credentials provided were invalid.');
        }

        const verified = verifyHash(parsedInput.password, user.password);

        if (!verified) {
            throw new ActionError('The credentials provided were invalid.');
        }

        if (user.isLockedOut) {
            throw new ActionError(
                'This account has been locked out, please try again later.'
            );
        }

        await createSession({
            sub: user.id,
            email: user.emailAddress,
            given_name: user.firstName,
            family_name: user.lastName,
            roles: user.roles as Role[],
        });

        redirect('/');
    });

export const logoutAction = async () => {
    await deleteSession();
    redirect('/account/login');
};

const registerSchema = z.object({
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
        .refine(isInPast, {
            message: 'Date Of Birth must be in the past',
        }),
});

type RegisterResponse = {
    id: string;
};

export const registerAction = actionClient
    .metadata({ actionName: 'registerAction' })
    .inputSchema(registerSchema)
    .action<RegisterResponse>(async ({ parsedInput }) => {
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

const forgotPasswordSchema = z.object({
    emailAddress: z.email('Email Address must be a valid email'),
});

export const forgotPasswordAction = actionClient
    .metadata({ actionName: 'forgotPasswordAction' })
    .inputSchema(forgotPasswordSchema)
    .action(async ({ parsedInput }) => {
        const normalizedEmailAddress = parsedInput.emailAddress.toLowerCase();

        const [user] = await db
            .select({
                id: users.id,
                emailAddress: users.emailAddress,
                isLockedOut: users.isLockedOut,
            })
            .from(users)
            .where(eq(users.normalizedEmailAddress, normalizedEmailAddress))
            .limit(1);

        if (!user || user.isLockedOut) {
            return;
        }

        const passwordResetToken = randomBytes(16)
            .toString('hex')
            .toUpperCase();

        const hashedPasswordResetToken = generateHash(passwordResetToken);

        await db
            .update(users)
            .set({ passwordResetToken: hashedPasswordResetToken })
            .where(eq(users.id, user.id));

        const siteUrl = await getSiteUrl();

        await sendEmail({
            to: user.emailAddress,
            subject: 'Reset Password // Halcyon',
            react: ResetPasswordEmail({
                siteUrl,
                passwordResetToken,
            }),
        });
    });

const resetPasswordSchema = z.object({
    token: z
        .string({ message: 'Token must be a valid string' })
        .regex(/^[A-F0-9]{32}$/, 'Token is not in the correct format'),
    emailAddress: z.email('Email Address must be a valid email'),
    newPassword: z
        .string({ message: 'New Password must be a valid string' })
        .min(8, 'New Password must be at least 8 characters')
        .max(50, 'New Password must be no more than 50 characters'),
});

type ResetPasswordResponse = {
    id: string;
};

export const resetPasswordAction = actionClient
    .metadata({ actionName: 'resetPasswordAction' })
    .inputSchema(resetPasswordSchema)
    .action<ResetPasswordResponse>(async ({ parsedInput }) => {
        const normalizedEmailAddress = parsedInput.emailAddress.toLowerCase();

        const [user] = await db
            .select({
                id: users.id,
                passwordResetToken: users.passwordResetToken,
                isLockedOut: users.isLockedOut,
            })
            .from(users)
            .where(eq(users.normalizedEmailAddress, normalizedEmailAddress))
            .limit(1);

        if (!user || user.isLockedOut || !user.passwordResetToken) {
            throw new ActionError('Invalid token.');
        }

        const verified = verifyHash(parsedInput.token, user.passwordResetToken);

        if (!verified) {
            throw new ActionError('Invalid token.');
        }

        const password = generateHash(parsedInput.newPassword);

        await db
            .update(users)
            .set({
                password,
                passwordResetToken: null,
            })
            .where(eq(users.id, user.id));

        return { id: user.id };
    });
