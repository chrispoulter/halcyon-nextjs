import { Metadata } from 'next';
import { useAction } from 'next-safe-action/hooks';
import { logoutAction } from '@/app/account/actions/logout-action';
import { Button } from '@/components/ui/button';
import { ServerActionErrorMessage } from '@/components/server-action-error';
import { toast } from '@/hooks/use-toast';

export const metadata: Metadata = {
    title: 'Unauthorized',
};

export default function Unauthorized() {
    const { execute, isPending } = useAction(logoutAction, {
        onError: ({ error }) => {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: <ServerActionErrorMessage result={error} />,
            });
        },
    });

    function onLogout() {
        execute();
    }

    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Unauthorized
            </h1>

            <p className="leading-7">
                Sorry, there was a problem with your session. Please log out and
                log back in.
            </p>

            <Button
                className="w-full min-w-32 sm:w-auto"
                onClick={onLogout}
                disabled={isPending}
            >
                Log out
            </Button>
        </main>
    );
}
