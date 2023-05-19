import * as Yup from 'yup';
import { today } from '@/utils/dates';

export const registerSchema = Yup.object().shape({
    emailAddress: Yup.string()
        .label('Email Address')
        .max(254)
        .email()
        .required(),
    password: Yup.string().label('Password').min(8).max(50).required(),
    firstName: Yup.string().label('First Name').max(50).required(),
    lastName: Yup.string().label('Last Name').max(50).required(),
    dateOfBirth: Yup.date().label('Date Of Birth').max(today).required()
});

export type RegisterRequest = Yup.InferType<typeof registerSchema>;

export const forgotPasswordSchema = Yup.object().shape({
    emailAddress: Yup.string()
        .label('Email Address')
        .max(254)
        .email()
        .required()
});

export type ForgotPasswordRequest = Yup.InferType<typeof forgotPasswordSchema>;

export const resetPasswordSchema = Yup.object().shape({
    token: Yup.string().label('Token').required(),
    emailAddress: Yup.string()
        .label('Email Address')
        .max(254)
        .email()
        .required(),
    newPassword: Yup.string().label('New Password').min(8).max(50).required()
});

export type ResetPasswordRequest = Yup.InferType<typeof resetPasswordSchema>;
