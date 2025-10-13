import type { SafeActionResult } from 'next-safe-action';

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
    if (result?.validationErrors) {
        const flattenedErrors = [
            ...result.validationErrors.formErrors,
            ...Object.values(result.validationErrors.fieldErrors).flat(),
        ];

        return (
            <ul className="list-inside list-disc text-sm">
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
