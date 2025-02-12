import { Metadata } from 'next';
import { CreateUser } from '@/app/user/create/create-user';

export const metadata: Metadata = {
    title: 'Create User',
};

export default async function CreateUserPage() {
    return <CreateUser />;
}
