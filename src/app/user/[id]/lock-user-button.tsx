'use client';

import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { GetUserResponse } from '@/app/actions/getUserAction';
import { lockUserAction } from '@/app/actions/lockUserAction';
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
import { toast } from '@/hooks/use-toast';

type LockUserButtonProps = {
    user: GetUserResponse;
    disabled?: boolean;
    className?: string;
};

export function LockUserButton({
    user,
    disabled,
    className,
}: LockUserButtonProps) {
    const router = useRouter();

    const { execute, isPending } = useAction(lockUserAction, {
        onSuccess() {
            toast({
                title: 'User successfully locked.',
            });

            router.refresh();
        },
        onError() {
            toast({
                variant: 'destructive',
                title: 'An error occurred while processing your request.',
            });
        },
    });

    function onLock() {
        execute({ id: user.id });
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="secondary"
                    disabled={isPending || disabled}
                    className={className}
                >
                    Lock
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
                    <AlertDialogAction
                        disabled={isPending || disabled}
                        onClick={onLock}
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
