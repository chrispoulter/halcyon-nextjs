import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Access Denied',
};

export default function Unauthorized() {
    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Access Denied
            </h1>

            <p className="leading-7">
                Sorry, you do not have access to this resource.
            </p>

            <Button asChild className="w-full" variant="secondary">
                <Link href="/user">Home</Link>
            </Button>
        </main>
    );
}
