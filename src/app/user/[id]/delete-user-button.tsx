'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { deleteUserAction } from '@/app/user/actions/delete-user-action';
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

type DeleteUserButtonProps = {
    user: GetUserResponse;
    className?: string;
};

export function DeleteUserButton({ user, className }: DeleteUserButtonProps) {
    const router = useRouter();

    const [isPending, startTransition] = useTransition();

    async function onDelete() {
        startTransition(async () => {
            const result = await deleteUserAction({
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
                description: 'User successfully deleted.',
            });

            router.push('/user');
        });
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="destructive"
                    disabled={isPending}
                    className={className}
                >
                    {isPending ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        'Delete'
                    )}
                </Button>
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
                    <AlertDialogAction disabled={isPending} onClick={onDelete}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
