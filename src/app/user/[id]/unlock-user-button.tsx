'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { unlockUserAction } from '@/app/user/actions/unlock-user-action';
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

    const [isPending, startTransition] = useTransition();

    async function onUnlock() {
        startTransition(async () => {
            const result = await unlockUserAction({
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
                description: 'User successfully locked.',
            });

            router.refresh();
        });
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="secondary"
                    disabled={isPending || disabled}
                    className={className}
                >
                    {isPending ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        'Unlock'
                    )}
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
