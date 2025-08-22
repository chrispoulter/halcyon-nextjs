import type { Metadata } from 'next';
import { ResetPassword } from '@/app/account/reset-password/[token]/reset-password';

export const metadata: Metadata = {
    title: 'Reset Password',
};

export default async function ResetPasswordPage({
    params,
}: PageProps<'/account/reset-password/[token]'>) {
    const { token } = await params;

    return <ResetPassword token={token} />;
}
