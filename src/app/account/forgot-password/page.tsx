import type { Metadata } from 'next';
import { ForgotPassword } from './forgot-password';

export const metadata: Metadata = {
    title: 'Forgot Password',
};

export default async function ForgotPasswordPage() {
    return <ForgotPassword />;
}
