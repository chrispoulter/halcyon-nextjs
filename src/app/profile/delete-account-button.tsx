import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { deleteAccountAction } from '@/app/profile/actions/delete-account-action';
import type { GetProfileResponse } from '@/app/profile/profile-types';
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

type DeleteAccountButtonProps = {
    profile: GetProfileResponse;
    className?: string;
};

export function DeleteAccountButton({
    profile,
    className,
}: DeleteAccountButtonProps) {
    const router = useRouter();

    const { execute: deleteAccount, isPending: isDeleting } = useAction(
        deleteAccountAction,
        {
            onSuccess() {
                toast.success('Your account has been deleted.');
                router.push('/');
            },
            onError({ error }) {
                toast.error(<ServerActionErrorMessage result={error} />);
            },
        }
    );

    function onDelete() {
        deleteAccount({
            version: profile.version,
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
                    Delete Account
                </LoadingButton>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Account</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete your account? All of
                        your data will be permanently removed. This action
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
