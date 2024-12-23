import { Metadata } from 'next';
import { ResetPasswordForm } from '@/app/account/reset-password/[token]/reset-password-form';

export const metadata: Metadata = {
    title: 'Reset Password',
};

type Params = Promise<{ token: string }>;

export default async function ResetPassword({ params }: { params: Params }) {
    const { token } = await params;

    return (
        <main className="mx-auto max-w-screen-sm p-6">
            <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                Reset Password
            </h1>

            <p className="mt-6 leading-7">
                Reset your password below. Choose a strong password and
                don&apos;t reuse it for other accounts. For security reasons,
                change your password on a regular basis.
            </p>

            <ResetPasswordForm token={token} className="mt-6" />
        </main>
    );
}
