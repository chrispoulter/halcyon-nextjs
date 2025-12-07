'use client';

import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { disableTwoFactorAction } from '@/app/profile/actions/disable-two-factor-action';
import { LoadingButton } from '@/components/loading-button';
import { ServerActionError } from '@/components/server-action-error';

export function DisableTwoFactorButton() {
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
        <LoadingButton onClick={onDisable} loading={isDisabling}>
            Disable Two Factor
        </LoadingButton>
    );
}
