import {
    createSafeActionClient,
    DEFAULT_SERVER_ERROR_MESSAGE,
} from 'next-safe-action';
import { z } from 'zod';
import { forbidden, notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { Role } from '@/lib/definitions';

export class ActionError extends Error {
    constructor(
        message: string,
        public status?: number
    ) {
        super(message);
        this.name = 'ActionError';
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
            switch (error.status) {
                case 404:
                    notFound();
            }

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
            redirect('/account/login');
        }

        if (roles && !roles.some((value) => session.roles?.includes(value))) {
            forbidden();
        }

        const { sub: userId } = session;

        return next({ ctx: { userId } });
    });
