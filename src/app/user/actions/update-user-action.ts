'use server';

import { z } from 'zod';
import type { UpdateUserResponse } from '@/app/user/user-types';
import { apiClient } from '@/lib/api-client';
import { isInPast } from '@/lib/dates';
import { authActionClient } from '@/lib/safe-action';
import { Role } from '@/lib/session-types';

const schema = z.object({
    id: z
        .string({ message: 'Id must be a valid string' })
        .uuid('Id must be a valid UUID'),
    emailAddress: z
        .string({ message: 'Email Address must be a valid string' })
        .email('Email Address must be a valid email'),
    firstName: z
        .string({ message: 'First Name must be a valid string' })
        .min(1, 'First Name is a required field')
        .max(50, 'First Name must be no more than 50 characters'),
    lastName: z
        .string({ message: 'Last Name must be a valid string' })
        .min(1, 'Last Name is a required field')
        .max(50, 'Last Name must be no more than 50 characters'),
    dateOfBirth: z
        .string({
            message: 'Date of Birth must be a valid string',
        })
        .date('Date Of Birth must be a valid date')
        .refine(isInPast, { message: 'Date Of Birth must be in the past' }),
    roles: z
        .array(
            z.nativeEnum(Role, {
                message: 'Role must be a valid user role',
            }),
            { message: 'Role must be a valid array' }
        )
        .optional(),
    version: z.number({ message: 'Version must be a valid number' }).optional(),
});

const roles = [Role.SYSTEM_ADMINISTRATOR, Role.USER_ADMINISTRATOR];

export const updateUserAction = authActionClient(roles)
    .metadata({ actionName: 'updateUserAction' })
    .schema(schema)
    .action(async ({ parsedInput: { id, ...rest }, ctx: { accessToken } }) => {
        return await apiClient.put<UpdateUserResponse>(`/user/${id}`, rest, {
            Authorization: `Bearer ${accessToken}`,
        });
    });
