import { InferType, date, object, string } from 'yup';

export type GetProfileResponse = {
    id: number;
    emailAddress: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    version: string;
};

export const updateProfileSchema = object().shape({
    emailAddress: string().label('Email Address').max(254).email().required(),
    firstName: string().label('First Name').max(50).required(),
    lastName: string().label('Last Name').max(50).required(),
    dateOfBirth: date().label('Date Of Birth').required(),
    version: string().label('Version').uuid()
});

export type UpdateProfileRequest = InferType<typeof updateProfileSchema>;

export const changePasswordSchema = object().shape({
    currentPassword: string().label('Current Password').required(),
    newPassword: string().label('New Password').min(8).max(50).required(),
    version: string().label('Version').uuid()
});

export type ChangePasswordRequest = InferType<typeof changePasswordSchema>;

export const deleteAccountSchema = object().shape({
    version: string().label('Version').uuid()
});

export type DeleteAccountRequst = InferType<typeof deleteAccountSchema>;
