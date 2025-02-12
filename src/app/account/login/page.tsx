import { Metadata } from 'next';
import { Login } from '@/app/account/login/login';

export const metadata: Metadata = {
    title: 'Login',
};

export default async function LoginPage() {
    return <Login />;
}
