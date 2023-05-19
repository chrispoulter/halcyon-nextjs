import * as Yup from 'yup';

export type GetProfileResponse = {
    id: number;
    emailAddress: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
};

export const updateProfileSchema = Yup.object().shape({
    emailAddress: Yup.string()
        .label('Email Address')
        .max(254)
        .email()
        .required(),
    firstName: Yup.string().label('First Name').max(50).required(),
    lastName: Yup.string().label('Last Name').max(50).required(),
    dateOfBirth: Yup.date().label('Date Of Birth').required()
});

export type UpdateProfileRequest = Yup.InferType<typeof updateProfileSchema>;

export const changePasswordSchema = Yup.object().shape({
    currentPassword: Yup.string().label('Current Password').required(),
    newPassword: Yup.string().label('New Password').min(8).max(50).required()
});

export type ChangePasswordRequest = Yup.InferType<typeof changePasswordSchema>;
