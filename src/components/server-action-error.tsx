import { SafeActionResult } from 'next-safe-action';
import { z } from 'zod';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type FlattenedSafeActionResult<TSchema extends z.ZodType, TData> =
    | SafeActionResult<
          string,
          TSchema | undefined,
          readonly TSchema[] | readonly [],
          | {
                formErrors: string[];
                fieldErrors: {
                    [key: string]: string[] | undefined;
                };
            }
          | undefined,
          | readonly []
          | readonly {
                formErrors: string[];
                fieldErrors: {
                    [key: string]: string[] | undefined;
                };
            }[],
          TData
      >
    | undefined;

type ServerActionErrorProps<TSchema extends z.ZodType, TData> = {
    result?: FlattenedSafeActionResult<TSchema, TData>;
};

export function ServerActionError<TSchema extends z.ZodType, TData>({
    result,
}: ServerActionErrorProps<TSchema, TData>) {
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

export function ServerActionErrorMessage<TSchema extends z.ZodType, TData>({
    result,
}: ServerActionErrorProps<TSchema, TData>) {
    if (result?.bindArgsValidationErrors) {
        const flattenedErrors = result.bindArgsValidationErrors.flatMap(
            (item) => [
                ...item.formErrors,
                ...Object.values(item.fieldErrors).flat(),
            ]
        );

        return (
            <ul className="ml-6 list-disc space-y-0.5">
                {flattenedErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                ))}
            </ul>
        );
    }

    if (result?.validationErrors) {
        const flattenedErrors = [
            ...result.validationErrors.formErrors,
            ...Object.values(result.validationErrors.fieldErrors).flat(),
        ];

        return (
            <ul className="ml-6 list-disc space-y-0.5">
                {flattenedErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                ))}
            </ul>
        );
    }

    return (
        result?.serverError ||
        'An error occurred while processing your request.'
    );
}

export function isServerActionSuccessful<TSchema extends z.ZodType, TData>(
    result?: FlattenedSafeActionResult<TSchema, TData>
): result is {
    data: TData;
} {
    if (!result) {
        return false;
    }

    if (result.bindArgsValidationErrors) {
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
