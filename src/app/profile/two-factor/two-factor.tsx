'use client';

import Link from 'next/link';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { confirmTwoFactorAction } from '@/app/profile/actions/confirm-two-factor-action';
import { SetupTwoFactorResponse } from '@/app/profile/data/setup-two-factor';
import {
    TwoFactorForm,
    TwoFactorFormValues,
} from '@/app/profile/two-factor/two-factor-form';
import { Button } from '@/components/ui/button';
import { ServerActionError } from '@/components/server-action-error';

type TwoFactorProps = {
    twoFactorSetup: SetupTwoFactorResponse;
};

export function TwoFactor({ twoFactorSetup }: TwoFactorProps) {
    const { execute: confirmTwoFactor, isPending: isConfirming } = useAction(
        confirmTwoFactorAction,
        {
            onSuccess({ data }) {
                if (data?.recoveryCodes) {
                    toast.success('Two factor authentication enabled.');
                    // Optionally show recovery codes inline or prompt download
                    alert(
                        `Recovery Codes:\n\n${data.recoveryCodes.join('\n')}`
                    );
                }
            },
            onError({ error }) {
                toast.error(<ServerActionError result={error} />);
            },
        }
    );

    function onSubmit(values: TwoFactorFormValues) {
        confirmTwoFactor(values);
    }

    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
                Enable Two Factor Authentication
            </h1>
            <p className="leading-7">
                Scan the QR code with your authenticator app (e.g., Authy), then
                enter the 6-digit code to confirm setup. If you cannot scan the
                QR code, manually enter the setup key below in your
                authenticator app.
            </p>

            <div className="flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={twoFactorSetup.qr}
                    alt="Authenticator QR code"
                    className="rounded border"
                />
            </div>

            <div className="space-y-2">
                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    Manual Setup Key
                </h2>
                <p className="text-muted-foreground text-sm">
                    Enter this key in your authenticator app if you cannot scan
                    the QR code.
                </p>
                <div className="flex items-center gap-2">
                    <code className="rounded border px-2 py-1 text-sm break-all">
                        {twoFactorSetup.secret}
                    </code>
                    <button
                        type="button"
                        className="rounded border px-2 py-1 text-sm"
                        onClick={() => {
                            navigator.clipboard.writeText(
                                twoFactorSetup.secret
                            );
                            toast.success(
                                'Two factor key copied to clipboard.'
                            );
                        }}
                    >
                        Copy
                    </button>
                </div>
            </div>

            <TwoFactorForm onSubmit={onSubmit} loading={isConfirming}>
                <Button asChild variant="outline">
                    <Link href="/profile">Cancel</Link>
                </Button>
            </TwoFactorForm>
        </main>
    );
}
