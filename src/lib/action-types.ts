import { z } from 'zod';

export type ServerActionResult<Data = unknown> = {
    data?: Data;
    serverError?: string;
    validationErrors?: z.inferFlattenedErrors<z.ZodType<any, any, any>>;
};

export function isServerActionSuccessful<Data>(
    result?: ServerActionResult<Data>
): result is {
    data: Data;
} {
    if (!result) {
        return false;
    }

    if (result.validationErrors) {
        return false;
    }

    if (result.serverError) {
        return false;
    }

    return true;
}
