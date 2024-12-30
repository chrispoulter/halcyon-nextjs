import {
    BindArgsValidationErrors,
    createSafeActionClient,
    SafeActionResult,
    ValidationErrors,
} from 'next-safe-action';
import { z } from 'zod';
import { verifySession } from '@/lib/session';
import { Role } from '@/lib/session-types';

export const actionClient = createSafeActionClient();

export function authActionClient(roles?: Role[]) {
    return actionClient.use(async ({ next }) => {
        const { accessToken } = await verifySession(roles);
        return next({ ctx: { accessToken } });
    });
}

export function isActionSuccessful<T extends z.ZodType>(
    action?: SafeActionResult<
        string,
        T,
        readonly T[],
        ValidationErrors<T>,
        BindArgsValidationErrors<readonly T[]>
    >
): action is {
    data: T;
} {
    if (!action) {
        return false;
    }

    if (action.serverError) {
        return false;
    }

    if (action.validationErrors) {
        return false;
    }

    if (action.bindArgsValidationErrors) {
        return false;
    }

    return true;
}
