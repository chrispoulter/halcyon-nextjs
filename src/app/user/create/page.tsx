import type { Metadata } from 'next';
import { CreateUser } from '@/app/user/create/create-user';
import { isUserAdministrator } from '@/lib/definitions';
import { ensureAuthorized } from '@/lib/permissions';

export const metadata: Metadata = {
    title: 'Create User',
};

export default async function CreateUserPage() {
    await ensureAuthorized(isUserAdministrator);
    return <CreateUser />;
}
