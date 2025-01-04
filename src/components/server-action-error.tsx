import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ServerActionResult } from '@/lib/action-types';

type ServerActionErrorProps<T> = {
    result: ServerActionResult<T>;
};

export function ServerActionError<Data>({
    result,
}: ServerActionErrorProps<Data>) {
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

export function ServerActionErrorMessage<Data>({
    result,
}: ServerActionErrorProps<Data>) {
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

    return result?.error || 'An error occurred while processing your request.';
}
