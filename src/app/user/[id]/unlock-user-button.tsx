'use client';

import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { Loader2 } from 'lucide-react';
import { unlockUserAction } from '@/app/user/actions/unlock-user-action';
import { GetUserResponse } from '@/app/user/user-types';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ServerActionErrorMessage } from '@/components/server-action-error';
import { toast } from '@/hooks/use-toast';

type UnlockUserButtonProps = {
    user: GetUserResponse;
    className?: string;
};

export function UnlockUserButton({ user, className }: UnlockUserButtonProps) {
    const router = useRouter();

    const { execute, isPending } = useAction(unlockUserAction, {
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'User successfully locked.',
            });

            router.refresh();
        },
        onError: ({ error }) => {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: <ServerActionErrorMessage result={error} />,
            });
        },
    });

    function onUnlock() {
        execute({
            id: user.id,
            version: user.version,
        });
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="secondary"
                    disabled={isPending}
                    className={className}
                >
                    {isPending ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        'Unlock'
                    )}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Unlock User</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to unlock this user account? The
                        user will now be able to access the system.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={isPending} onClick={onUnlock}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
