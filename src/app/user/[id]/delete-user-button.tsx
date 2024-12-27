'use client';

import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { Loader2 } from 'lucide-react';
import type { GetUserResponse } from '@/app/user/user-definitions';
import { deleteUserAction } from '@/app/user/actions/delete-user-action';
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

type DeleteUserButtonProps = {
    user: GetUserResponse;
    disabled?: boolean;
    className?: string;
};

export function DeleteUserButton({
    user,
    disabled,
    className,
}: DeleteUserButtonProps) {
    const router = useRouter();

    const { execute, isPending } = useAction(deleteUserAction, {
        onSuccess() {
            toast({
                title: 'User successfully deleted.',
            });

            router.push('/user');
        },
        onError() {
            toast({
                variant: 'destructive',
                title: 'An error occurred while processing your request.',
            });
        },
    });

    function onDelete() {
        execute({ id: user.id });
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="destructive"
                    disabled={isPending || disabled}
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
                    <AlertDialogAction
                        disabled={isPending || disabled}
                        onClick={onDelete}
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
