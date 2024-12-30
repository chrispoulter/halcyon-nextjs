import {
    BindArgsValidationErrors,
    SafeActionResult,
    ValidationErrors,
} from 'next-safe-action';
import { z } from 'zod';

export type ProblemDetails = {
    type: string;
    title: string;
    status: number;
    traceId: string;
    errors?: Record<string, string[]>;
};

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
