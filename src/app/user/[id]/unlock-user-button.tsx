import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { unlockUserAction } from '@/app/user/actions/unlock-user-action';
import type { GetUserResponse } from '@/app/user/user-types';
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
import { ServerActionErrorMessage } from '@/components/server-action-error';

type UnlockUserButtonProps = {
    user: GetUserResponse;
    className?: string;
};

export function UnlockUserButton({ user, className }: UnlockUserButtonProps) {
    const router = useRouter();

    const { execute: unlockUser, isPending: isUnlocking } = useAction(
        unlockUserAction,
        {
            onSuccess() {
                toast.success('User successfully unlocked.');
                router.refresh();
            },
            onError({ error }) {
                toast.error(<ServerActionErrorMessage result={error} />);
            },
        }
    );

    function onUnlock() {
        unlockUser({
            id: user.id,
            version: user.version,
        });
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <LoadingButton
                    variant="secondary"
                    loading={isUnlocking}
                    className={className}
                >
                    Unlock
                </LoadingButton>
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
                        disabled={isUnlocking}
                        onClick={onUnlock}
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
