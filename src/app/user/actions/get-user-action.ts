'use server';

import { z } from 'zod';
import type { GetUserResponse } from '@/app/user/user-types';
import { authActionClient } from '@/lib/safe-action';
import { Role } from '@/lib/definitions';

const schema = z.object({
    id: z
        .string({ message: 'Id must be a valid string' })
        .uuid('Id must be a valid UUID'),
});

const roles = [Role.SYSTEM_ADMINISTRATOR, Role.USER_ADMINISTRATOR];

export const getUserAction = authActionClient(roles)
    .metadata({ actionName: 'getUserAction' })
    .schema(schema)
    .action(async ({ parsedInput: { id }, ctx: { userId } }) => {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        console.log('request', id, userId);

        return {
            id: 'fake-id',
            emailAddress: 'fake.name@example.com',
            firstName: 'Fake',
            lastName: 'Name',
            dateOfBirth: '1970-01-01',
            roles: [Role.SYSTEM_ADMINISTRATOR, Role.USER_ADMINISTRATOR],
            version: 1234,
        } as GetUserResponse;
    });
