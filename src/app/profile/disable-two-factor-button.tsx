import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { disableTwoFactorAction } from '@/app/profile/actions/disable-two-factor-action';
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

type DisableTwoFactorButtonProps = {
    className?: string;
};

export function DisableTwoFactorButton({
    className,
}: DisableTwoFactorButtonProps) {
    const { execute: disableTwoFactor, isPending: isDisabling } = useAction(
        disableTwoFactorAction,
        {
            onSuccess() {
                toast.success('Two factor authentication disabled.');
            },
            onError({ error }) {
                toast.error(<ServerActionError result={error} />);
            },
        }
    );

    function onDisable() {
        disableTwoFactor();
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <LoadingButton
                    variant="destructive"
                    loading={isDisabling}
                    className={className}
                >
                    Disable Two Factor
                </LoadingButton>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Disable Two Factor</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to disable two factor
                        authentication?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isDisabling}
                        onClick={onDisable}
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
