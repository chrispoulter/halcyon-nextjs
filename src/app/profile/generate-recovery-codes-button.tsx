import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { generateRecoveryCodesAction } from '@/app/profile/actions/generate-recovery-codes-action';
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

type GenerateRecoveryCodesButtonProps = {
    className?: string;
};

export function GenerateRecoveryCodesButton({
    className,
}: GenerateRecoveryCodesButtonProps) {
    const { execute: generateRecoveryCodes, isPending: isGenerating } =
        useAction(generateRecoveryCodesAction, {
            onSuccess({ data }) {
                if (data.recoveryCodes) {
                    toast.success('Recovery codes generated.');

                    // Optionally show recovery codes inline or prompt download
                    alert(
                        `Recovery Codes:\n\n${data.recoveryCodes.join('\n')}`
                    );
                }
            },
            onError({ error }) {
                toast.error(<ServerActionError result={error} />);
            },
        });

    function onGenerate() {
        generateRecoveryCodes();
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <LoadingButton loading={isGenerating} className={className}>
                    Generate Recovery Codes
                </LoadingButton>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Generate Recovery Codes</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to generate new recovery codes? If
                        you lose your device and don&apos;t have the recovery
                        codes you will lose access to your account.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isGenerating}
                        onClick={onGenerate}
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
