'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import { verifyTwoFactorAction } from '@/app/profile/actions/verify-two-factor-action';
import { type GetTwoFactorConfigResponse } from '@/app/profile/data/get-two-factor-config';
import {
    EnableAuthenticatorForm,
    EnableAuthenticatorFormValues,
} from '@/app/profile/enable-authenticator/enable-authenticator-form';
import { RecoveryCodesDialog } from '@/app/profile/recovery-codes-dialog';
import { Button } from '@/components/ui/button';
import { ServerActionError } from '@/components/server-action-error';

type EnableAuthenticatorProps = {
    configuration: GetTwoFactorConfigResponse;
};

export function EnableAuthenticator({
    configuration,
}: EnableAuthenticatorProps) {
    const router = useRouter();

    const [recoveryCodes, setRecoveryCodes] = useState<string[] | undefined>();

    const { execute: verifyTwoFactor, isPending: isVerifying } = useAction(
        verifyTwoFactorAction,
        {
            onSuccess({ data }) {
                if (data.recoveryCodes) {
                    toast.success(
                        'Two-factor authentication has been enabled.'
                    );
                    setRecoveryCodes(data.recoveryCodes);
                }
            },
            onError({ error }) {
                toast.error(<ServerActionError result={error} />);
            },
        }
    );

    function onOpenChange() {
        router.push('/profile');
    }

    function onSubmit(values: EnableAuthenticatorFormValues) {
        verifyTwoFactor(values);
    }

    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
                Configure Authenticator App
            </h1>

            <p className="leading-7">
                To use an authenticator app go through the following steps:
            </p>

            <ol className="ml-6 list-decimal space-y-2">
                <li>
                    Download a two-factor authenticator app like Microsoft
                    Authenticator for{' '}
                    <a
                        href="https://go.microsoft.com/fwlink/?Linkid=825072"
                        className="underline underline-offset-4"
                    >
                        Android
                    </a>{' '}
                    and{' '}
                    <a
                        href="https://go.microsoft.com/fwlink/?Linkid=825073"
                        className="underline underline-offset-4"
                    >
                        iOS
                    </a>{' '}
                    or Google Authenticator for{' '}
                    <a
                        href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&amp;hl=en"
                        className="underline underline-offset-4"
                    >
                        Android
                    </a>{' '}
                    and{' '}
                    <a
                        href="https://itunes.apple.com/us/app/google-authenticator/id388497605?mt=8"
                        className="underline underline-offset-4"
                    >
                        iOS
                    </a>
                    .
                </li>
                <li>
                    Scan the QR Code or enter this key{' '}
                    <code className="bg-muted rounded px-2 py-1 font-mono font-semibold">
                        {configuration.secret}
                    </code>{' '}
                    into your two-factor authenticator app.
                    <QRCodeSVG
                        value={configuration.otpauth}
                        size={180}
                        marginSize={3}
                        className="mt-2 rounded border"
                    />
                </li>
                <li>
                    Once you have scanned the QR code or input the key above,
                    your two-factor authentication app will provide you with a
                    unique code. Enter the code in the confirmation box below.
                </li>
            </ol>

            <EnableAuthenticatorForm onSubmit={onSubmit} loading={isVerifying}>
                <Button asChild variant="outline">
                    <Link href="/profile">Cancel</Link>
                </Button>
            </EnableAuthenticatorForm>

            <RecoveryCodesDialog
                open={!!recoveryCodes}
                onOpenChange={onOpenChange}
                codes={recoveryCodes}
            />
        </main>
    );
}
