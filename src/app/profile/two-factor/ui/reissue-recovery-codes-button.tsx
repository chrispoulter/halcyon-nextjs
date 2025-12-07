'use client';

import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { reissueRecoveryCodesAction } from '@/app/profile/actions/generate-recovery-codes-action';
import { LoadingButton } from '@/components/loading-button';

export function ReissueRecoveryCodesButton() {
    const { execute, isPending } = useAction(reissueRecoveryCodesAction, {
        onSuccess({ data }) {
            if (data?.recoveryCodes) {
                toast.success('New recovery codes issued');
                // Optionally show recovery codes inline or prompt download
                alert(`Recovery Codes:\n\n${data.recoveryCodes.join('\n')}`);
            }
        },
        onError({ error }) {
            toast.error(error.serverError ?? 'An error occurred');
        },
    });

    return (
        <LoadingButton onClick={() => execute()} loading={isPending}>
            Reissue Recovery Codes
        </LoadingButton>
    );
}
