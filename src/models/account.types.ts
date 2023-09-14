import { InferType, date, object, string } from 'yup';

export const registerSchema = object().shape({
    emailAddress: string().label('Email Address').max(254).email().required(),
    password: string().label('Password').min(8).max(50).required(),
    firstName: string().label('First Name').max(50).required(),
    lastName: string().label('Last Name').max(50).required(),
    dateOfBirth: date().label('Date Of Birth').required()
});

export type RegisterRequest = InferType<typeof registerSchema>;

export const forgotPasswordSchema = object().shape({
    emailAddress: string().label('Email Address').max(254).email().required(),
    siteUrl: string().label('Site Url').max(254).url().required()
});

export type ForgotPasswordRequest = InferType<typeof forgotPasswordSchema>;

export const resetPasswordSchema = object().shape({
    token: string().label('Token').uuid().required(),
    emailAddress: string().label('Email Address').max(254).email().required(),
    newPassword: string().label('New Password').min(8).max(50).required()
});

export type ResetPasswordRequest = InferType<typeof resetPasswordSchema>;
