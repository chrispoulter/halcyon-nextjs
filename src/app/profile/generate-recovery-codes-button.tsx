import { useState } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { generateRecoveryCodesAction } from '@/app/profile/actions/generate-recovery-codes-action';
import { RecoveryCodesDialog } from '@/app/profile/recovery-codes-dialog';
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
    const [recoveryCodes, setRecoveryCodes] = useState<string[] | undefined>();

    const { execute: generateRecoveryCodes, isPending: isGenerating } =
        useAction(generateRecoveryCodesAction, {
            onSuccess({ data }) {
                if (data.recoveryCodes) {
                    toast.success('Recovery codes have been generated.');
                    setRecoveryCodes(data.recoveryCodes);
                }
            },
            onError({ error }) {
                toast.error(<ServerActionError result={error} />);
            },
        });

    function onGenerate() {
        generateRecoveryCodes();
    }

    function onOpenChange(open: boolean) {
        if (!open) {
            setRecoveryCodes(undefined);
        }
    }

    return (
        <>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <LoadingButton loading={isGenerating} className={className}>
                        Generate Recovery Codes
                    </LoadingButton>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Generate Recovery Codes
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to generate new recovery
                            codes?
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

            <RecoveryCodesDialog
                open={!!recoveryCodes}
                onOpenChange={onOpenChange}
                codes={recoveryCodes}
            />
        </>
    );
}
