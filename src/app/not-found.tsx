import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Not Found',
};

export default function NotFound() {
    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Not Found
            </h1>

            <p className="leading-7">
                Sorry, the resource you were looking for could not be found.
            </p>

            <Button asChild className="w-full sm:w-auto">
                <Link href="/">Home</Link>
            </Button>
        </main>
    );
}
