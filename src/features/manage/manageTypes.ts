import { InferType, number, object, string } from 'yup';
import '@/utils/yup';

export type GetProfileResponse = {
    id: string;
    emailAddress: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    version: number;
};

export const updateProfileSchema = object().shape({
    emailAddress: string().label('Email Address').max(254).email().required(),
    firstName: string().label('First Name').max(50).required(),
    lastName: string().label('Last Name').max(50).required(),
    dateOfBirth: string().label('Date Of Birth').required().dateOnly().past(),
    version: number().label('Version')
});

export type UpdateProfileRequest = InferType<typeof updateProfileSchema>;

export const changePasswordSchema = object().shape({
    currentPassword: string().label('Current Password').required(),
    newPassword: string().label('New Password').min(8).max(50).required(),
    version: number().label('Version')
});

export type ChangePasswordRequest = InferType<typeof changePasswordSchema>;

export const deleteAccountSchema = object().shape({
    version: number().label('Version')
});

export type DeleteAccountRequst = InferType<typeof deleteAccountSchema>;
