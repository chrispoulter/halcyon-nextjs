import {
    FlattenedBindArgsValidationErrors,
    FlattenedValidationErrors,
    SafeActionResult,
    ValidationErrors,
} from 'next-safe-action';
import { Schema } from 'next-safe-action/adapters/types';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type FlattenedSafeActionResult<S extends Schema, Data> = SafeActionResult<
    string,
    S,
    readonly S[],
    FlattenedValidationErrors<ValidationErrors<any>>,
    FlattenedBindArgsValidationErrors<readonly ValidationErrors<any>[]>,
    Data
>;

type ServerActionErrorProps<S extends Schema, Data> = {
    result?: FlattenedSafeActionResult<S, Data>;
};

export function ServerActionError<S extends Schema, Data>({
    result,
}: ServerActionErrorProps<S, Data>) {
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

export function ServerActionErrorMessage<S extends Schema, Data>({
    result,
}: ServerActionErrorProps<S, Data>) {
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

export function isServerActionSuccess<S extends Schema, Data>(
    result?: FlattenedSafeActionResult<S, Data>
): result is {
    data: Data;
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
