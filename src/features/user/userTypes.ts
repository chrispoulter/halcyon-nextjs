import { InferType, array, number, object, string } from 'yup';
import { toDateOnlyISOString } from '@/utils/date';

export enum UserSort {
    EMAIL_ADDRESS_ASC = 'EMAIL_ADDRESS_ASC',
    EMAIL_ADDRESS_DESC = 'EMAIL_ADDRESS_DESC',
    NAME_ASC = 'NAME_ASC',
    NAME_DESC = 'NAME_DESC'
}

export const searchUsersSchema = object().shape({
    search: string().label('Search'),
    sort: string<UserSort>()
        .label('Sort')
        .oneOf(Object.values(UserSort))
        .default(UserSort.NAME_ASC),
    page: number().label('Page').min(1).default(1),
    size: number().label('Size').min(1).max(50).default(50)
});

export type SearchUsersRequest = InferType<typeof searchUsersSchema>;

export type SearchUserResponse = {
    id: number;
    emailAddress: string;
    firstName: string;
    lastName: string;
    isLockedOut?: boolean;
    roles?: string[];
};

export type SearchUsersResponse = {
    items?: SearchUserResponse[];
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
};

export const createUserSchema = object().shape({
    emailAddress: string().label('Email Address').max(254).email().required(),
    password: string().label('Password').min(8).max(50).required(),
    firstName: string().label('First Name').max(50).required(),
    lastName: string().label('Last Name').max(50).required(),
    dateOfBirth: string()
        .label('Date Of Birth')
        .required()
        .test(
            'date-in-past',
            '${label} must be in the past',
            value => new Date(value) < new Date()
        )
        .transform(toDateOnlyISOString),
    roles: array().of(string().label('Role').required()).label('Roles')
});

export type CreateUserRequest = InferType<typeof createUserSchema>;

export const getUserSchema = object().shape({
    id: number().label('Id').required()
});

export type GetUserResponse = {
    id: number;
    emailAddress: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    isLockedOut?: boolean;
    roles?: string[];
    version: string;
};

export const updateUserSchema = object().shape({
    emailAddress: string().label('Email Address').max(254).email().required(),
    firstName: string().label('First Name').max(50).required(),
    lastName: string().label('Last Name').max(50).required(),
    dateOfBirth: string()
        .label('Date Of Birth')
        .required()
        .test(
            'date-in-past',
            '${label} must be in the past',
            value => new Date(value) < new Date()
        )
        .transform(toDateOnlyISOString),
    roles: array().of(string().label('Role').required()).label('Roles'),
    version: string().label('Version').uuid()
});

export type UpdateUserRequest = InferType<typeof updateUserSchema>;

export const lockUserSchema = object().shape({
    version: string().label('Version').uuid()
});

export type LockUserRequest = InferType<typeof lockUserSchema>;

export const unlockUserSchema = object().shape({
    version: string().label('Version').uuid()
});

export type UnlockUserRequest = InferType<typeof unlockUserSchema>;

export const deleteUserSchema = object().shape({
    version: string().label('Version').uuid()
});

export type DeleteUserRequest = InferType<typeof deleteUserSchema>;
