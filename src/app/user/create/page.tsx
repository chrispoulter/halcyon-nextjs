import type { Metadata } from 'next';
import { CreateUser } from '@/app/user/create/create-user';
import { isUserAdministrator } from '@/lib/definitions';
import { verifySession } from '@/lib/permissions';

export const metadata: Metadata = {
    title: 'Create User',
};

export default async function CreateUserPage() {
    await verifySession(isUserAdministrator);
    return <CreateUser />;
}
