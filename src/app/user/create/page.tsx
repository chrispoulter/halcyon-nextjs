import { Metadata } from 'next';
import { CreateUserForm } from '@/app/user/create/create-user-form';

export const metadata: Metadata = {
    title: 'Create User',
};

export default async function CreateUser() {
    return (
        <main className="mx-auto max-w-screen-sm p-6">
            <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                Create User
            </h1>

            <p className="mt-6 leading-7">
                Create a new account for a user to access the full range of
                features available on this site.
            </p>

            <CreateUserForm className="mt-6" />
        </main>
    );
}
