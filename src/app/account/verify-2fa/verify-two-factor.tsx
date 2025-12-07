'use client';

import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { verifyTwoFactorAction } from '@/app/account/actions/verify-2fa-action';
import { TextField } from '@/components/form/text-field';
import { LoadingButton } from '@/components/loading-button';
import { ServerActionError } from '@/components/server-action-error';

const schema = z
    .object({
        code: z.string().max(6).optional(),
        recoveryCode: z.string().max(100).optional(),
    })
    .refine((data) => !!data.code || !!data.recoveryCode, {
        message: 'Provide either a 2FA code or a recovery code',
        path: ['code'],
    });

export type VerifyFormValues = z.infer<typeof schema>;

export function VerifyTwoFactor() {
    const router = useRouter();
    const { execute: verify, isPending } = useAction(verifyTwoFactorAction, {
        onSuccess() {
            router.push('/');
        },
        onError({ error }) {
            toast.error(<ServerActionError result={error} />);
        },
    });

    const form = useForm<VerifyFormValues>({
        resolver: zodResolver(schema),
        defaultValues: { code: '', recoveryCode: '' },
    });

    function onSubmit(values: VerifyFormValues) {
        verify(values);
    }

    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
                Two Factor Verification
            </h1>
            <p className="leading-7">
                Enter your 6-digit code from your authenticator app. If you
                cannot access your app, enter a recovery code.
            </p>

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
                    disabled={isPending}
                />

                <TextField
                    control={form.control}
                    name="recoveryCode"
                    label="Recovery Code (optional)"
                    type="text"
                    maxLength={100}
                    disabled={isPending}
                />

                <div className="flex justify-end">
                    <LoadingButton type="submit" loading={isPending}>
                        Verify
                    </LoadingButton>
                </div>
            </form>
        </main>
    );
}
