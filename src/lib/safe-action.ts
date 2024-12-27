import { createSafeActionClient } from 'next-safe-action';
import { verifySession } from '@/lib/session';
import { Role } from '@/lib/session-types';

export const actionClient = createSafeActionClient({
    defaultValidationErrorsShape: 'flattened',
});

export const authActionClient = (roles?: Role[]) =>
    actionClient.use(async ({ next }) => {
        const { accessToken } = await verifySession(roles);
        return next({ ctx: { accessToken } });
    });
