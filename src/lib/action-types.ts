import { z } from 'zod';

export type ServerActionResult<Data = unknown> = {
    data?: Data;
    error?: string;
    validationErrors?: z.inferFlattenedErrors<z.ZodType<any, any, any>>;
};

export function isServerActionSuccess<Data>(
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

    if (result.error) {
        return false;
    }

    return true;
}
