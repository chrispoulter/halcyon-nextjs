import { Metadata } from 'next';
import { ResetPassword } from '@/app/account/reset-password/[token]/reset-password';

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

    return <ResetPassword token={token} />;
}
