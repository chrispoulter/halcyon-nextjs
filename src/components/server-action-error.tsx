type ServerActionErrorResult = {
    serverError?: string;
    validationErrors?: {
        formErrors: string[];
        fieldErrors: Record<string, string[]>;
    };
};

export function ServerActionError({
    result,
}: {
    result?: ServerActionErrorResult;
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
