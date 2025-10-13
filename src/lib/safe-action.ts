import {
    createSafeActionClient,
    DEFAULT_SERVER_ERROR_MESSAGE,
} from 'next-safe-action';
import { z } from 'zod';
import type { Role } from '@/lib/definitions';
import { getSession } from '@/lib/session';

export class ActionError extends Error {
    status?: number;

    constructor(message: string, status?: number) {
        super(message);
        this.name = 'ActionError';
        this.status = status;
    }
}

export const actionClient = createSafeActionClient({
    defaultValidationErrorsShape: 'flattened',
    defineMetadataSchema() {
        return z.object({
            actionName: z.string(),
        });
    },
    handleServerError: (error, utils) => {
        if (error instanceof ActionError) {
            return error.message;
        }

        // Log the error to an error reporting service
        console.error(error, utils.metadata);

        return DEFAULT_SERVER_ERROR_MESSAGE;
    },
});

export const authActionClient = (roles?: Role[]) =>
    actionClient.use(async ({ next }) => {
        const session = await getSession();

        if (!session) {
            throw new ActionError('Unauthorized.', 401);
        }

        if (roles && !roles.some((value) => session.roles?.includes(value))) {
            throw new ActionError('Forbidden.', 403);
        }

        return next({ ctx: { userId: session.sub } });
    });
