import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type ServerActionErrorProps = {
    result: any;
};

export function ServerActionError({ result }: ServerActionErrorProps) {
    const { serverError, validationErrors } = result;

    return (
        <div className="mx-auto max-w-screen-sm p-6">
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>

                {serverError && (
                    <AlertDescription>{serverError}</AlertDescription>
                )}

                {validationErrors && (
                    <AlertDescription>
                        {validationErrors.map((error: any) => (
                            <p key={error.message}>{error.message}</p>
                        ))}
                    </AlertDescription>
                )}

                {!serverError && !validationErrors && (
                    <AlertDescription>
                        An error occurred while processing your request.
                    </AlertDescription>
                )}
            </Alert>
        </div>
    );
}
