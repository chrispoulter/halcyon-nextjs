import { Metadata } from 'next';
import { ForgotPassword } from '@/app/account/forgot-password/forgot-password';

export const metadata: Metadata = {
    title: 'Forgot Password',
};

export default async function ForgotPasswordPage() {
    return <ForgotPassword />;
}
