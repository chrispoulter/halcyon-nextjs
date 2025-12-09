'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { verifyTwoFactorAction } from '@/app/profile/actions/verify-two-factor-action';
import { type GetTwoFactorConfigResponse } from '@/app/profile/data/get-two-factor-config';
import {
    TwoFactorForm,
    TwoFactorFormValues,
} from '@/app/profile/two-factor/two-factor-form';
import { RecoveryCodesDialog } from '@/app/profile/recovery-codes-dialog';
import { Button } from '@/components/ui/button';
import { ServerActionError } from '@/components/server-action-error';

type TwoFactorProps = {
    configuration: GetTwoFactorConfigResponse;
};

export function TwoFactor({ configuration }: TwoFactorProps) {
    const router = useRouter();
    const [recoveryCodes, setRecoveryCodes] = useState<string[] | undefined>();
    const [showDialog, setShowDialog] = useState(false);

    const { execute: verifyTwoFactor, isPending: isVerifying } = useAction(
        verifyTwoFactorAction,
        {
            onSuccess({ data }) {
                if (data.recoveryCodes) {
                    toast.success('Two-factor authentication enabled.');
                    setRecoveryCodes(data.recoveryCodes);
                    setShowDialog(true);
                    router.push('/profile');
                }
            },
            onError({ error }) {
                toast.error(<ServerActionError result={error} />);
            },
        }
    );

    function onSubmit(values: TwoFactorFormValues) {
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
                    <code className="bg-muted rounded p-1 font-mono font-semibold">
                        {configuration.secret}
                    </code>{' '}
                    into your two-factor authenticator app. Spaces and casing do
                    not matter.
                    <Image
                        src={configuration.otpauthUri}
                        width={180}
                        height={180}
                        alt="Authenticator QR Code"
                        className="mt-2 rounded border bg-white p-1"
                        unoptimized
                    />
                </li>
                <li>
                    Once you have scanned the QR code or input the key above,
                    your two-factor authentication app will provide you with a
                    unique code. Enter the code in the confirmation box below.
                </li>
            </ol>

            <TwoFactorForm onSubmit={onSubmit} loading={isVerifying}>
                <Button asChild variant="outline">
                    <Link href="/profile">Cancel</Link>
                </Button>
            </TwoFactorForm>

            <RecoveryCodesDialog
                open={showDialog}
                onOpenChange={setShowDialog}
                codes={recoveryCodes}
            />
        </main>
    );
}
