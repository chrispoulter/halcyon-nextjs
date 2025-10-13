'use client';

import { useEffect } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type ErrorPageProps = Readonly<{
    error: Error & { digest?: string };
    reset: () => void;
}>;

export const metadata: Metadata = {
    title: 'Error',
};

export default function Error({ error }: ErrorPageProps) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error.message);
    }, [error]);

    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
                Error
            </h1>

            <p className="leading-7">
                Sorry, something went wrong. Please try again later.
            </p>

            <Button asChild className="w-full sm:w-auto">
                <Link href="/">Home</Link>
            </Button>
        </main>
    );
}
