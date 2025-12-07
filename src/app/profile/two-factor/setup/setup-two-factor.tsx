'use client';

import { useEffect, useState } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { setupTwoFactorAction } from '@/app/profile/actions/setup-two-factor-action';
import { confirmTwoFactorAction } from '@/app/profile/actions/confirm-two-factor-action';
import { TextField } from '@/components/form/text-field';
import { LoadingButton } from '@/components/loading-button';

const schema = z.object({ code: z.string().min(6).max(6) });

type FormValues = z.infer<typeof schema>;

export function SetupTwoFactor() {
    const [qr, setQr] = useState<string | null>(null);
    const [secret, setSecret] = useState<string | null>(null);

    const setup = useAction(setupTwoFactorAction, {
        onSuccess({ data }) {
            setQr(data?.qr ?? null);
            setSecret(data?.secret ?? null);
        },
        onError({ error }) {
            toast.error(error.serverError ?? 'An error occurred');
        },
    });

    const confirm = useAction(confirmTwoFactorAction, {
        onSuccess({ data }) {
            if (data?.recoveryCodes) {
                toast.success(
                    'Two factor enabled. Save your recovery codes now.'
                );
                // Optionally show recovery codes inline or prompt download
                alert(`Recovery Codes:\n\n${data.recoveryCodes.join('\n')}`);
            }
        },
        onError({ error }) {
            toast.error(error.serverError ?? 'An error occurred');
        },
    });

    useEffect(() => {
        setup.execute({});
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
                Scan the QR code with your authenticator app (e.g., Authy), then
                enter the 6-digit code to confirm setup. If you cannot scan the
                QR code, manually enter the setup key below in your
                authenticator app.
            </p>

            {qr && (
                <div className="flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={qr}
                        alt="Authenticator QR code"
                        className="rounded border"
                    />
                </div>
            )}

            {secret && (
                <div className="space-y-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        Manual Setup Key
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        Enter this key in your authenticator app if you cannot
                        scan the QR code.
                    </p>
                    <div className="flex items-center gap-2">
                        <code className="rounded border px-2 py-1 text-sm break-all">
                            {secret}
                        </code>
                        <button
                            type="button"
                            className="rounded border px-2 py-1 text-sm"
                            onClick={() => {
                                if (secret) {
                                    navigator.clipboard.writeText(secret);
                                    toast.success(
                                        'Setup key copied to clipboard'
                                    );
                                }
                            }}
                        >
                            Copy
                        </button>
                    </div>
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
