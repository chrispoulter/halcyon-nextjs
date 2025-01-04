import { Metadata } from 'next';
import { ResetPasswordForm } from '@/app/account/reset-password/[token]/reset-password-form';

export const metadata: Metadata = {
    title: 'Reset Password',
};

type Params = Promise<{ token: string }>;

export default async function ResetPassword({ params }: { params: Params }) {
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
