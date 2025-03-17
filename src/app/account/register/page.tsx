import { Metadata } from 'next';
import { Register } from '@/app/account/register/register';

export const metadata: Metadata = {
    title: 'Register',
};

export default async function RegisterPage() {
    return <Register />;
}
