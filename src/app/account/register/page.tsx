import type { Metadata } from 'next';
import { Register } from './register';

export const metadata: Metadata = {
    title: 'Register',
};

export default async function RegisterPage() {
    return <Register />;
}
