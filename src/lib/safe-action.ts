import {
    createSafeActionClient,
    DEFAULT_SERVER_ERROR_MESSAGE,
} from 'next-safe-action';
import { verifySession } from '@/lib/session';
import { Role } from '@/lib/session-types';

export class ActionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ActionError';
    }
}

export const actionClient = createSafeActionClient({
    defaultValidationErrorsShape: 'flattened',
    handleServerError(e) {
        if (e instanceof ActionError) {
            return e.message;
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
