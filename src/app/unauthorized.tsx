import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Unauthorized',
};

export default function Unauthorized() {
    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Unauthorized
            </h1>

            <p className="leading-7">
                Sorry, something went wrong. Please try logging in again.
            </p>

            <Button asChild className="w-full min-w-32 sm:w-auto">
                <Link href="/">Home</Link>
            </Button>
        </main>
    );
}
