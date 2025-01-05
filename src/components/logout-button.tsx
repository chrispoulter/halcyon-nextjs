'use client';

import { useAction } from 'next-safe-action/hooks';
import { logoutAction } from '@/app/account/actions/logout-action';
import { Button } from '@/components/ui/button';
import { ServerActionErrorMessage } from '@/components/server-action-error';
import { toast } from '@/hooks/use-toast';

export function LogoutButton() {
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
        <Button
            className="w-full min-w-32 sm:w-auto"
            onClick={onLogout}
            disabled={isPending}
        >
            Log out
        </Button>
    );
}
