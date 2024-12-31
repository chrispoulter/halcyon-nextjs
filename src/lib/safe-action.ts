import {
    createSafeActionClient,
    DEFAULT_SERVER_ERROR_MESSAGE,
} from 'next-safe-action';
import { verifySession } from '@/lib/session';
import { Role } from '@/lib/session-types';

export class ActionError extends Error {}

export const actionClient = createSafeActionClient({
    defaultValidationErrorsShape: 'flattened',
    handleServerError: (error) => {
        if (error instanceof ActionError) {
            return error.message;
        }

        return DEFAULT_SERVER_ERROR_MESSAGE;
    },
});

export function authActionClient(roles?: Role[]) {
    return actionClient.use(async ({ next }) => {
        const { accessToken } = await verifySession(roles);
        return next({ ctx: { accessToken } });
    });
}
