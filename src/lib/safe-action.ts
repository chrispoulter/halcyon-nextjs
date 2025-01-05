import {
    createSafeActionClient,
    DEFAULT_SERVER_ERROR_MESSAGE,
} from 'next-safe-action';
import { ApiClientError } from '@/lib/api-client';
import { SessionError } from '@/lib/session';

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
