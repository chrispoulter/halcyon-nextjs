import { SafeActionResult } from 'next-safe-action';
import { z } from 'zod';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type FlattenedSafeActionResult<T extends z.ZodType> =
    | SafeActionResult<
          string,
          T | undefined,
          readonly T[] | readonly [],
          | {
                formErrors: string[];
                fieldErrors: {
                    [key: string]: string[] | undefined;
                };
            }
          | undefined,
          readonly []
      >
    | undefined;

type ServerActionErrorProps<T extends z.ZodType> = {
    result?: FlattenedSafeActionResult<T>;
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
    if (result?.validationErrors) {
        return (
            <ul className="ml-6 list-disc space-y-0.5">
                {[
                    ...result.validationErrors.formErrors,
                    ...Object.values(
                        result.validationErrors.fieldErrors
                    ).flat(),
                ].map((error) => (
                    <li key={error}>{error}</li>
                ))}
            </ul>
        );
    }

    return (
        result?.serverError ||
        'An error occurred while processing your request.'
    );
}

export function isActionSuccessful<T extends z.ZodType>(
    result?: FlattenedSafeActionResult<T>
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

    return true;
}
