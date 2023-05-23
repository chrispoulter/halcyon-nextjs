import { z } from 'zod';

export type GetProfileResponse = {
    id: number;
    emailAddress: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
};

export const updateProfileSchema = z.object({
    emailAddress: z.string().max(254).email(),
    firstName: z.string().max(50),
    lastName: z.string().max(50),
    dateOfBirth: z.coerce.date()
});

export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(8).max(50)
});

export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>;
