'use client';

import { useRouter } from 'next/navigation';
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
    className?: string;
};

export function UnlockUserButton({ user, className }: UnlockUserButtonProps) {
    const router = useRouter();

    async function onUnlock() {
        const result = await unlockUserAction({ id: user.id });

        toast({
            title: 'User successfully unlocked.',
            description: JSON.stringify(result),
        });

        router.refresh();
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" className={className}>
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
                    <AlertDialogAction onClick={onUnlock}>
                        Unlock
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
