import {
    BindArgsValidationErrors,
    SafeActionResult,
    ValidationErrors,
} from 'next-safe-action';
import { z } from 'zod';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type ServerActionErrorProps<T extends z.ZodType> = {
    result?:
        | SafeActionResult<
              string,
              T,
              readonly T[],
              ValidationErrors<T>,
              BindArgsValidationErrors<readonly T[]>
          >
        | SafeActionResult<
              string,
              undefined,
              readonly [],
              | {
                    formErrors: string[];
                    fieldErrors: object;
                }
              | undefined,
              readonly []
          >
        | undefined;
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
        return JSON.stringify(result.validationErrors);
    }

    if (result?.bindArgsValidationErrors) {
        return JSON.stringify(result.bindArgsValidationErrors);
    }

    return (
        result?.serverError ||
        'An error occurred while processing your request.'
    );
}
