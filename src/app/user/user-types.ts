import type { Role } from '@/lib/definitions';

export type UserSort =
    | 'EMAIL_ADDRESS_ASC'
    | 'EMAIL_ADDRESS_DESC'
    | 'NAME_ASC'
    | 'NAME_DESC';

export type SearchUsersResponse = {
    items: {
        id: string;
        emailAddress: string;
        firstName: string;
        lastName: string;
        isLockedOut: boolean;
        roles?: Role[];
    }[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

export type GetUserResponse = {
    id: string;
    emailAddress: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    isLockedOut: boolean;
    roles?: Role[];
    version: number;
};

export type CreateUserResponse = {
    id: string;
};

export type UpdateUserResponse = {
    id: string;
};

export type LockUserResponse = {
    id: string;
};

export type UnlockUserResponse = {
    id: string;
};

export type DeleteUserResponse = {
    id: string;
};
