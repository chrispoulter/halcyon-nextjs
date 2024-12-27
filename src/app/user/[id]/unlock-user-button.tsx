'use client';

import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { GetUserResponse } from '@/app/actions/getUserAction';
import { unlockUserAction } from '@/app/actions/unlockUserAction';
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

type UnlockUserButtonProps = {
    user: GetUserResponse;
    disabled?: boolean;
    className?: string;
};

export function UnlockUserButton({
    user,
    disabled,
    className,
}: UnlockUserButtonProps) {
    const router = useRouter();

    const { execute, isPending } = useAction(unlockUserAction, {
        onSuccess() {
            toast({
                title: 'User successfully unlocked.',
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

    function onUnlock() {
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
                    Unlock
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
                    <AlertDialogAction
                        disabled={isPending || disabled}
                        onClick={onUnlock}
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
