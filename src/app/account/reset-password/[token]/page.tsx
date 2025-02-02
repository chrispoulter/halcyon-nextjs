import { Metadata } from 'next';
import { ResetPasswordForm } from '@/app/account/reset-password/[token]/reset-password-form';

type ResetPasswordPageProps = {
    params: Promise<{ token: string }>;
};

export const metadata: Metadata = {
    title: 'Reset Password',
};

export default async function ResetPasswordPage({
    params,
}: ResetPasswordPageProps) {
    const { token } = await params;

    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Reset Password
            </h1>

            <p className="leading-7">
                Reset your password below. Choose a strong password and
                don&apos;t reuse it for other accounts. For security reasons,
                change your password on a regular basis.
            </p>

            <ResetPasswordForm token={token} />
        </main>
    );
}
