import * as Yup from 'yup';
import { minDateOfBirth, maxDateOfBirth } from '@/utils/dates';
import { Role } from '@/utils/auth';

export enum UserSort {
    EMAIL_ADDRESS_ASC = 'EMAIL_ADDRESS_ASC',
    EMAIL_ADDRESS_DESC = 'EMAIL_ADDRESS_DESC',
    NAME_ASC = 'NAME_ASC',
    NAME_DESC = 'NAME_DESC'
}

export const searchUsersSchema = Yup.object().shape({
    search: Yup.string().label('Search'),
    sort: Yup.string<UserSort>()
        .label('Sort')
        .oneOf(Object.values(UserSort))
        .default(UserSort.NAME_ASC),
    page: Yup.number().label('Page').min(1).default(1),
    size: Yup.number().label('Size').min(1).max(50).default(50)
});

export type SearchUsersRequest = Yup.InferType<typeof searchUsersSchema>;

export type SearchUsersResponse = {
    items?: GetUserResponse[];
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
};

export const createUserSchema = Yup.object().shape({
    emailAddress: Yup.string()
        .label('Email Address')
        .max(254)
        .email()
        .required(),
    password: Yup.string().label('Password').min(8).max(50).required(),
    firstName: Yup.string().label('First Name').max(50).required(),
    lastName: Yup.string().label('Last Name').max(50).required(),
    dateOfBirth: Yup.date()
        .label('Date Of Birth')
        .min(minDateOfBirth)
        .max(maxDateOfBirth)
        .required(),
    roles: Yup.array()
        .of(
            Yup.string<Role>()
                .label('Role')
                .oneOf(Object.values(Role))
                .required()
        )
        .label('Roles')
});

export type CreateUserRequest = Yup.InferType<typeof createUserSchema>;

export const getUserSchema = Yup.object().shape({
    id: Yup.number().label('Id').required()
});

export type GetUserResponse = {
    id: number;
    emailAddress: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    isLockedOut?: boolean;
    roles?: Role[];
};

export const updateUserSchema = Yup.object().shape({
    emailAddress: Yup.string()
        .label('Email Address')
        .max(254)
        .email()
        .required(),
    firstName: Yup.string().label('First Name').max(50).required(),
    lastName: Yup.string().label('Last Name').max(50).required(),
    dateOfBirth: Yup.date()
        .label('Date Of Birth')
        .min(minDateOfBirth)
        .max(maxDateOfBirth)
        .required(),
    roles: Yup.array()
        .of(
            Yup.string<Role>()
                .label('Role')
                .oneOf(Object.values(Role))
                .required()
        )
        .label('Roles')
});

export type UpdateUserRequest = Yup.InferType<typeof updateUserSchema>;
