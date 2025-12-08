'use client';

import Link from 'next/link';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { verifyTwoFactorAction } from '@/app/profile/actions/verify-two-factor-action';
import { TwoFactorConfig } from '@/app/profile/data/get-two-factor-config';
import {
    EnableTwoFactorForm,
    EnableTwoFactorFormValues,
} from '@/app/profile/enable-two-factor/enable-two-factor-form';
import { Button } from '@/components/ui/button';
import { ServerActionError } from '@/components/server-action-error';

type EnableTwoFactorProps = {
    configuration: TwoFactorConfig;
};

export function EnableTwoFactor({ configuration }: EnableTwoFactorProps) {
    const { execute: verifyTwoFactor, isPending: isVerifying } = useAction(
        verifyTwoFactorAction,
        {
            onSuccess({ data }) {
                if (data?.recoveryCodes) {
                    toast.success('Two-factor authentication enabled.');
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

    function onSubmit(values: EnableTwoFactorFormValues) {
        verifyTwoFactor(values);
    }

    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
                Enable Two-Factor Authentication
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
                    <code className="bg-muted rounded p-1 font-mono font-semibold">
                        {configuration.secret}
                    </code>{' '}
                    into your two-factor authenticator app. Spaces and casing do
                    not matter.
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={configuration.otpauthUri}
                        alt="Authenticator QR code"
                        className="mt-2 rounded border bg-white p-1"
                    />
                </li>
                <li>
                    Once you have scanned the QR code or input the key above,
                    your two-factor authentication app will provide you with a
                    unique code. Enter the code in the confirmation box below.
                </li>
            </ol>

            <EnableTwoFactorForm onSubmit={onSubmit} loading={isVerifying}>
                <Button asChild variant="outline">
                    <Link href="/profile">Cancel</Link>
                </Button>
            </EnableTwoFactorForm>
        </main>
    );
}
