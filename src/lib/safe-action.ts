import {
    createSafeActionClient,
    DEFAULT_SERVER_ERROR_MESSAGE,
} from 'next-safe-action';
import { ApiClientError } from '@/lib/api-client';
import { getSession, SessionError } from '@/lib/session';
import { Role } from '@/lib/session-types';

export const actionClient = createSafeActionClient({
    defaultValidationErrorsShape: 'flattened',
    handleServerError: (error) => {
        if (error instanceof SessionError) {
            return error.message;
        }

        if (error instanceof ApiClientError) {
            return error.message;
        }

        return DEFAULT_SERVER_ERROR_MESSAGE;
    },
});

export const authActionClient = (roles?: Role[]) =>
    actionClient.use(async ({ next }) => {
        const session = await getSession();

        if (!session) {
            throw new SessionError('Unauthorized');
        }

        if (roles && !roles.some((value) => session.roles?.includes(value))) {
            throw new SessionError('Forbidden');
        }

        const { accessToken } = session;

        return next({ ctx: { accessToken } });
    });
