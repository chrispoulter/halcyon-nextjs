'use client';

import { useEffect } from 'react';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Error',
};

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Error
            </h1>

            <p className="leading-7">
                Sorry, something went wrong. Please try again later.
            </p>

            <Button className="w-full" variant="secondary" onClick={reset}>
                Try Again
            </Button>
        </main>
    );
}
