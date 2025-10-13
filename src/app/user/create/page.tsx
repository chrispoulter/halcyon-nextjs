import type { Metadata } from 'next';
import { CreateUser } from '@/app/user/create/create-user';
import { verifySession } from '@/lib/dal';
import { isUserAdministrator } from '@/lib/definitions';

export const metadata: Metadata = {
    title: 'Create User',
};

export default async function CreateUserPage() {
    await verifySession(isUserAdministrator);
    return <CreateUser />;
}
