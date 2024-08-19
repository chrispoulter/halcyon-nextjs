export enum UserSort {
    EMAIL_ADDRESS_ASC = 'EMAIL_ADDRESS_ASC',
    EMAIL_ADDRESS_DESC = 'EMAIL_ADDRESS_DESC',
    NAME_ASC = 'NAME_ASC',
    NAME_DESC = 'NAME_DESC'
}

export type SearchUsersRequest = {
    search?: string;
    sort: UserSort;
    page: number;
    size: number;
};

export type SearchUserResponse = {
    id: string;
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

export type CreateUserRequest = {
    emailAddress: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    roles?: string[];
};

export type GetUserResponse = {
    id: string;
    emailAddress: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    isLockedOut?: boolean;
    roles?: string[];
    version: number;
};

export type UpdateUserRequest = {
    emailAddress: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    roles?: string[];
    version?: number;
};

export type LockUserRequest = { version?: number };

export type UnlockUserRequest = { version?: number };

export type DeleteUserRequest = { version?: number };
