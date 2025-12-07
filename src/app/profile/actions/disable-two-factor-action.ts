'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { authActionClient, ActionError } from '@/lib/safe-action';

type DisableTwoFactorResponse = {
    id: string;
};

export const disableTwoFactorAction = authActionClient()
    .metadata({ actionName: 'disableTwoFactorAction' })
    .action<DisableTwoFactorResponse>(async ({ ctx: { userId } }) => {
        const [user] = await db
            .select({
                id: users.id,
                isLockedOut: users.isLockedOut,
            })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        if (!user || user.isLockedOut) {
            throw new ActionError('User not found.', 404);
        }

        await db
            .update(users)
            .set({
                twoFactorEnabled: false,
                twoFactorSecret: null,
                twoFactorTempSecret: null,
                twoFactorRecoveryCodes: null,
            })
            .where(eq(users.id, userId));

        revalidatePath('/users');
        revalidatePath(`/users/${user.id}`);
        revalidatePath('/profile');

        return { id: user.id };
    });
