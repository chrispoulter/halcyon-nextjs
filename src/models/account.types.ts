import { z } from 'zod';

export const registerSchema = z.object({
    emailAddress: z.string().max(254).email(),
    password: z.string().min(8).max(50),
    firstName: z.string().max(50).nonempty(),
    lastName: z.string().max(50).nonempty(),
    dateOfBirth: z.coerce.date()
});

export type RegisterRequest = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
    emailAddress: z.string().max(254).email()
});

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
    token: z.string().uuid(),
    emailAddress: z.string().max(254).email(),
    newPassword: z.string().min(8).max(50)
});

export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;
