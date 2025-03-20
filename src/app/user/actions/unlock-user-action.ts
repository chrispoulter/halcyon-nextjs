'use server';

import { z } from 'zod';
import type { UnlockUserResponse } from '@/app/user/user-types';
import { authActionClient } from '@/lib/safe-action';
import { Role } from '@/lib/definitions';

const schema = z.object({
    id: z
        .string({ message: 'Id must be a valid string' })
        .uuid('Id must be a valid UUID'),
    version: z.number({ message: 'Version must be a valid number' }).optional(),
});

const roles = [Role.SYSTEM_ADMINISTRATOR, Role.USER_ADMINISTRATOR];

export const unlockUserAction = authActionClient(roles)
    .metadata({ actionName: 'unlockUserAction' })
    .schema(schema)
    .action(async ({ parsedInput: { id, ...rest }, ctx: { userId } }) => {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        console.log('request', id, rest, userId);
        return { id: 'fake-id' } as UnlockUserResponse;
    });
