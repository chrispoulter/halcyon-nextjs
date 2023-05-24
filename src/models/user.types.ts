import { z } from 'zod';
import { Role } from '@/utils/auth';

export enum UserSort {
    EMAIL_ADDRESS_ASC = 'EMAIL_ADDRESS_ASC',
    EMAIL_ADDRESS_DESC = 'EMAIL_ADDRESS_DESC',
    NAME_ASC = 'NAME_ASC',
    NAME_DESC = 'NAME_DESC'
}

export const searchUsersSchema = z.object({
    search: z.string().optional(),
    sort: z.nativeEnum(UserSort).default(UserSort.NAME_ASC),
    page: z.coerce.number().min(1).default(1),
    size: z.coerce.number().min(1).max(50).default(50)
});

export type SearchUsersRequest = z.infer<typeof searchUsersSchema>;

export type SearchUsersResponse = {
    items?: GetUserResponse[];
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
};

export const createUserSchema = z.object({
    emailAddress: z.string().max(254).email(),
    password: z.string().min(8).max(50),
    firstName: z.string().max(50).nonempty(),
    lastName: z.string().max(50).nonempty(),
    dateOfBirth: z.coerce.date(),
    roles: z.array(z.nativeEnum(Role)).optional()
});

export type CreateUserRequest = z.infer<typeof createUserSchema>;

export const getUserSchema = z.object({
    id: z.number()
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

export const updateUserSchema = z.object({
    emailAddress: z.string().max(254).email(),
    firstName: z.string().max(50).nonempty(),
    lastName: z.string().max(50).nonempty(),
    dateOfBirth: z.coerce.date(),
    roles: z.array(z.nativeEnum(Role)).optional()
});

export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
