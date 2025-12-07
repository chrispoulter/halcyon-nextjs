'use client';

import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { disableTwoFactorAction } from '@/app/profile/actions/disable-twofactor-action';
import { LoadingButton } from '@/components/loading-button';

export function DisableTwoFactorButton() {
    const { execute, isPending } = useAction(disableTwoFactorAction, {
        onSuccess() {
            toast.success('Two factor authentication disabled');
        },
        onError({ error }) {
            toast.error(error.serverError ?? 'An error occurred');
        },
    });

    return (
        <LoadingButton onClick={() => execute()} loading={isPending}>
            Disable Two Factor
        </LoadingButton>
    );
}
