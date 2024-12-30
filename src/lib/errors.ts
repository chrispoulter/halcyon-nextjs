import { SafeActionResult } from 'next-safe-action';
import { z } from 'zod';

export class FetchError extends Error {
    status: number;
    statusText: string;
    content: any;

    constructor(response: Response, content: any) {
        super(`${response.status} - ${response.statusText}`);
        this.name = 'FetchError';
        this.status = response.status;
        this.statusText = response.statusText;
        this.content = content;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, FetchError);
        }
    }
}
export const isActionSuccessful = <T extends z.ZodType>(
    action?: SafeActionResult<string, T, readonly [], any, any>
): action is {
    data: T;
    serverError: undefined;
    validationError: undefined;
    bindArgsValidationErrors: undefined;
} => {
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
};
