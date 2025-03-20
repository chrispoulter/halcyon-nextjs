'use server';

import { z } from 'zod';
import type { DeleteAccountResponse } from '@/app/profile/profile-types';
import { authActionClient } from '@/lib/safe-action';
import { deleteSession } from '@/lib/session';

const schema = z.object({
    version: z.number({ message: 'Version must be a valid number' }).optional(),
});

export const deleteAccountAction = authActionClient()
    .metadata({ actionName: 'deleteAccountAction' })
    .schema(schema)
    .action(async ({ parsedInput, ctx: { userId } }) => {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        console.log('request', parsedInput, userId);
        await deleteSession();
        return { id: 'fake-id' } as DeleteAccountResponse;
    });
