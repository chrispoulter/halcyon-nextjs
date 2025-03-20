'use server';

import { z } from 'zod';
import type { ChangePasswordResponse } from '@/app/profile/profile-types';
import { authActionClient } from '@/lib/safe-action';

const schema = z.object({
    currentPassword: z
        .string({ message: 'Current Password must be a valid string' })
        .min(1, 'Current Password is a required field'),
    newPassword: z
        .string({ message: 'New Password must be a valid string' })
        .min(8, 'New Password must be at least 8 characters')
        .max(50, 'New Password must be no more than 50 characters'),
    version: z.number({ message: 'Version must be a valid number' }).optional(),
});

export const changePasswordAction = authActionClient()
    .metadata({ actionName: 'changePasswordAction' })
    .schema(schema)
    .action(async ({ parsedInput, ctx: { userId } }) => {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        console.log('request', parsedInput, userId);
        return { id: 'fake-id' } as ChangePasswordResponse;
    });
