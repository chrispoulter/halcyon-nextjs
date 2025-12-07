'use client';

import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { generateRecoveryCodesAction } from '@/app/profile/actions/generate-recovery-codes-action';
import { LoadingButton } from '@/components/loading-button';
import { ServerActionError } from '@/components/server-action-error';

export function GenerateRecoveryCodesButton() {
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
        <LoadingButton onClick={onGenerate} loading={isGenerating}>
            Generate Recovery Codes
        </LoadingButton>
    );
}
