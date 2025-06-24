import type { SafeActionResult } from 'next-safe-action';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type FlattenedSafeActionResult<T> = SafeActionResult<
    string,
    undefined,
    { formErrors: string[]; fieldErrors: Record<string, string[]> } | undefined,
    T,
    object
>;

export function ServerActionError<T>({
    result,
}: {
    result?: FlattenedSafeActionResult<T>;
}) {
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

export function ServerActionErrorMessage<T>({
    result,
}: {
    result?: FlattenedSafeActionResult<T>;
}) {
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

export function isServerActionSuccess<T>(
    result?: FlattenedSafeActionResult<T>
): result is { data: T } {
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
