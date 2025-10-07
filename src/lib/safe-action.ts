import {
    createSafeActionClient,
    DEFAULT_SERVER_ERROR_MESSAGE,
} from 'next-safe-action';
import { z } from 'zod';
import { notFound } from 'next/navigation';
import type { Role } from '@/lib/definitions';
import { verifySession } from './permissions';

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
        const session = await verifySession(roles);
        return next({ ctx: { userId: session.sub } });
    });
