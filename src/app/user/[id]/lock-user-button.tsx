'use client';

import { useRouter } from 'next/navigation';
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
    className?: string;
};

export function LockUserButton({ user, className }: LockUserButtonProps) {
    const router = useRouter();

    async function onLock() {
        const result = await lockUserAction({ id: user.id });

        toast({
            title: 'User successfully locked.',
            description: JSON.stringify(result),
        });

        router.refresh();
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" className={className}>
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
                    <AlertDialogAction onClick={onLock}>Lock</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
