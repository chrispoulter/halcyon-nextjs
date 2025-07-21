import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { deleteUserAction } from '@/app/user/actions/delete-user-action';
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

type DeleteUserButtonProps = {
    user: GetUserResponse;
    className?: string;
};

export function DeleteUserButton({ user, className }: DeleteUserButtonProps) {
    const router = useRouter();

    const { execute: deleteUser, isPending: isDeleting } = useAction(
        deleteUserAction,
        {
            onSuccess() {
                toast.success('User successfully deleted.');
                router.push('/user');
            },
            onError({ error }) {
                toast.error(<ServerActionErrorMessage result={error} />);
            },
        }
    );

    function onDelete() {
        deleteUser({
            id: user.id,
            version: user.version,
        });
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <LoadingButton
                    variant="destructive"
                    loading={isDeleting}
                    className={className}
                >
                    Delete
                </LoadingButton>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete User</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this user account? All
                        of the data will be permanently removed. This action
                        cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={isDeleting} onClick={onDelete}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
