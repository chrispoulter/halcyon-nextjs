import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
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
import { LoadingButton } from '@/components/loading-button';
import { ServerActionError } from '@/components/server-action-error';
import { lockUserAction } from '../users-actions';
import type { GetUserResponse } from '../users-data';

type LockUserButtonProps = {
    user: GetUserResponse;
    className?: string;
};

export function LockUserButton({ user, className }: LockUserButtonProps) {
    const { execute: lockUser, isPending: isLocking } = useAction(
        lockUserAction,
        {
            onSuccess() {
                toast.success('User successfully locked.');
            },
            onError({ error }) {
                toast.error(<ServerActionError result={error} />);
            },
        }
    );

    function onLock() {
        lockUser({
            id: user.id,
        });
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <LoadingButton
                    variant="secondary"
                    loading={isLocking}
                    className={className}
                >
                    Lock
                </LoadingButton>
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
                    <AlertDialogAction disabled={isLocking} onClick={onLock}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
