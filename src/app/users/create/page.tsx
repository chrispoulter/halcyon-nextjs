import type { Metadata } from 'next';
import { verifySession } from '@/lib/dal';
import { isUserAdministrator } from '@/lib/definitions';
import { CreateUser } from './create-user';

export const metadata: Metadata = {
    title: 'Create User',
};

export default async function CreateUserPage() {
    await verifySession(isUserAdministrator);
    return <CreateUser />;
}
