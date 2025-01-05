import { Metadata } from 'next';
import { LogoutButton } from '@/components/logout-button';

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
                Sorry, there was a problem with your session. Please log out and
                log back in.
            </p>

            <LogoutButton />
        </main>
    );
}
