import {
    createSafeActionClient,
    DEFAULT_SERVER_ERROR_MESSAGE,
} from 'next-safe-action';
import { ApiClientError } from '@/lib/api-client';
import { verifySession } from '@/lib/session';
import { Role } from '@/lib/session-types';

export const actionClient = createSafeActionClient({
    defaultValidationErrorsShape: 'flattened',
    handleServerError(e) {
        if (e instanceof ApiClientError) {
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
