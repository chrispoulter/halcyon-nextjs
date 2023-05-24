import { z } from 'zod';
import { today } from '@/utils/date';

export const registerSchema = z.object({
    emailAddress: z.string().max(254).email(),
    password: z.string().min(8).max(50),
    firstName: z.string().max(50).nonempty(),
    lastName: z.string().max(50).nonempty(),
    dateOfBirth: z.coerce.date().max(today)
});

export type RegisterRequest = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
    emailAddress: z.string().max(254).email()
});

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
    token: z.string(),
    emailAddress: z.string().max(254).email(),
    newPassword: z.string().min(8).max(50)
});

export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;
