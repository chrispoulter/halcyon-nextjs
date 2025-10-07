import type { Metadata } from 'next';
import { forbidden, redirect } from 'next/navigation';
import { CreateUser } from '@/app/user/create/create-user';
import { isUserAdministrator } from '@/lib/definitions';
import { getSession } from '@/lib/session';

export const metadata: Metadata = {
    title: 'Create User',
};

export default async function CreateUserPage() {
    const session = await getSession();

    if (!session) {
        redirect('/account/login');
    }

    if (!isUserAdministrator.some((value) => session.roles?.includes(value))) {
        forbidden();
    }

    return <CreateUser />;
}
