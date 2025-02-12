'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { changePasswordAction } from '@/app/profile/actions/change-password-action';
import {
    ChangePasswordForm,
    ChangePasswordFormValues,
} from '@/app/profile/change-password/change-password-form';
import { GetProfileResponse } from '@/app/profile/profile-types';
import { Button } from '@/components/ui/button';
import { ServerActionErrorMessage } from '@/components/server-action-error';

type ChangePasswordProps = {
    profile: GetProfileResponse;
};

export function ChangePassword({ profile }: ChangePasswordProps) {
    const router = useRouter();

    const { execute: changePassword, isPending: isSaving } = useAction(
        changePasswordAction,
        {
            onSuccess: () => {
                toast.success('Your password has been changed.');
                router.push('/profile');
            },
            onError: ({ error }) => {
                toast.error(<ServerActionErrorMessage result={error} />);
            },
        }
    );

    function onSubmit(data: ChangePasswordFormValues) {
        changePassword({
            ...data,
            version: profile.version,
        });
    }

    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Change Password
            </h1>

            <p className="leading-7">
                Change your password below. Choose a strong password and
                don&apos;t reuse it for other accounts. For security reasons,
                change your password on a regular basis.
            </p>

            <ChangePasswordForm loading={isSaving} onSubmit={onSubmit}>
                <Button asChild variant="outline">
                    <Link href="/profile">Cancel</Link>
                </Button>
            </ChangePasswordForm>

            <p className="text-muted-foreground text-sm">
                Forgotten your password?{' '}
                <Link
                    href="/account/forgot-password"
                    className="underline underline-offset-4"
                >
                    Request reset
                </Link>
            </p>
        </main>
    );
}
