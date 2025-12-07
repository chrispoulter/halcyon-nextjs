'use client';

import { useEffect, useState } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { startTwoFactorSetupAction } from '@/app/profile/actions/start-twofactor-setup-action';
import { confirmTwoFactorSetupAction } from '@/app/profile/actions/confirm-twofactor-setup-action';
import { TextField } from '@/components/form/text-field';
import { LoadingButton } from '@/components/loading-button';
import Image from 'next/image';

const schema = z.object({ code: z.string().min(6).max(6) });

type FormValues = z.infer<typeof schema>;

export function SetupTwoFactor() {
    const [qr, setQr] = useState<string | null>(null);

    const start = useAction(startTwoFactorSetupAction, {
        onSuccess({ data }) {
            setQr(data?.qr ?? null);
        },
        onError({ error }) {
            toast.error(error.serverError ?? 'An error occurred');
        },
    });

    const confirm = useAction(confirmTwoFactorSetupAction, {
        onSuccess({ data }) {
            if (data?.recoveryCodes) {
                toast.success(
                    'Two factor enabled. Save your recovery codes now.'
                );
                // Optionally show recovery codes inline or prompt download
                alert(`Recovery Codes:\n\n${data?.recoveryCodes.join('\n')}`);
            }
        },
        onError({ error }) {
            toast.error(error.serverError ?? 'An error occurred');
        },
    });

    useEffect(() => {
        start.execute({});
    }, []);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { code: '' },
    });

    function onSubmit(values: FormValues) {
        confirm.execute(values);
    }

    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
                Enable Two Factor Authentication
            </h1>
            <p className="leading-7">
                Scan the QR code with your authenticator app (e.g., Authy), or
                manually add the setup code. Then enter the 6-digit code to
                confirm setup.
            </p>

            {qr && (
                <div className="flex justify-center">
                    <img
                        src={qr}
                        alt="Authenticator QR code"
                        className="rounded border"
                    />
                </div>
            )}

            <form
                noValidate
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <TextField
                    control={form.control}
                    name="code"
                    label="Authenticator Code"
                    type="text"
                    maxLength={6}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="123456"
                    disabled={confirm.isPending}
                />

                <div className="flex justify-end">
                    <LoadingButton type="submit" loading={confirm.isPending}>
                        Confirm
                    </LoadingButton>
                </div>
            </form>
        </main>
    );
}
