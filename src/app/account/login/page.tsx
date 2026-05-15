import type { Metadata } from 'next';
import { Login } from './login';

export const metadata: Metadata = {
    title: 'Login',
};

export default async function LoginPage() {
    return <Login />;
}
