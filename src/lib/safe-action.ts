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
    result?:
        | SafeActionResult<
              string,
              T,
              readonly T[],
              ValidationErrors<T>,
              BindArgsValidationErrors<readonly T[]>
          >
        | SafeActionResult<
              string,
              undefined,
              readonly [],
              | {
                    formErrors: string[];
                    fieldErrors: object;
                }
              | undefined,
              readonly []
          >
        | undefined
): result is {
    data: T;
} {
    if (!result) {
        return false;
    }

    if (result.serverError) {
        return false;
    }

    if (result.validationErrors) {
        return false;
    }

    if (result.bindArgsValidationErrors) {
        return false;
    }

    return true;
}
