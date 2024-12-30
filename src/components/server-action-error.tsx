import {
    BindArgsValidationErrors,
    SafeActionResult,
    ValidationErrors,
} from 'next-safe-action';
import { z } from 'zod';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type ServerActionErrorProps<T extends z.ZodType> = {
    result?: SafeActionResult<
        string,
        T,
        readonly T[],
        ValidationErrors<T>,
        BindArgsValidationErrors<readonly T[]>
    >;
};

export function ServerActionError<T extends z.ZodType>({
    result,
}: ServerActionErrorProps<T>) {
    return (
        <div className="mx-auto max-w-screen-sm p-6">
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    <ServerActionErrorMessage result={result} />
                </AlertDescription>
            </Alert>
        </div>
    );
}

export function ServerActionErrorMessage<T extends z.ZodType>({
    result,
}: ServerActionErrorProps<T>) {
    if (!result) {
        return null;
    }

    const { serverError, validationErrors, bindArgsValidationErrors } = result;

    if (serverError) {
        return serverError;
    }

    if (validationErrors) {
        return JSON.stringify(validationErrors);
    }

    if (bindArgsValidationErrors) {
        return JSON.stringify(bindArgsValidationErrors);
    }

    if (bindArgsValidationErrors) {
        return JSON.stringify(bindArgsValidationErrors);
    }

    return 'An error occurred while processing your request.';
}
