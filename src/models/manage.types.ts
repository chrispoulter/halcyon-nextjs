import { z } from 'zod';
import { isLessThanOrEqualToday } from '@/utils/date';

export type GetProfileResponse = {
    id: number;
    emailAddress: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
};

export const updateProfileSchema = z.object({
    emailAddress: z.string().max(254).email(),
    firstName: z.string().max(50).nonempty(),
    lastName: z.string().max(50).nonempty(),
    dateOfBirth: z.coerce.date().refine(isLessThanOrEqualToday, {
        message: 'The field must be a date on or before today'
    })
});

export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(8).max(50)
});

export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>;
