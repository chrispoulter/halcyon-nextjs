'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { lockUserAction } from '@/app/user/actions/lock-user-action';
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
import { isServerActionSuccess } from '@/lib/action-types';

type LockUserButtonProps = {
    user: GetUserResponse;
    className?: string;
};

export function LockUserButton({ user, className }: LockUserButtonProps) {
    const router = useRouter();

    const [isPending, startTransition] = useTransition();

    async function onLock() {
        startTransition(async () => {
            const result = await lockUserAction({
                id: user.id,
                version: user.version,
            });

            if (!isServerActionSuccess(result)) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: <ServerActionErrorMessage result={result} />,
                });

                return;
            }

            toast({
                title: 'Success',
                description: 'User successfully locked.',
            });

            router.refresh();
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
                    {isPending ? <Loader2 className="animate-spin" /> : 'Lock'}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Lock User</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to lock this user account? The
                        user will no longer be able to access the system.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={isPending} onClick={onLock}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
