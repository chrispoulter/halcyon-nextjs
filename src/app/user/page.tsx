import type { Metadata } from 'next';
import { forbidden, redirect } from 'next/navigation';
import { searchUsers } from '@/app/user/data/search-users';
import { SearchUsers } from '@/app/user/search-users';
import { isUserAdministrator } from '@/lib/definitions';
import { getSession } from '@/lib/session';

export const metadata: Metadata = {
    title: 'Users',
};

export default async function SearchUsersPage({
    searchParams,
}: PageProps<'/user'>) {
    const session = await getSession();

    if (!session) {
        redirect('/account/login');
    }

    if (!isUserAdministrator.some((value) => session.roles?.includes(value))) {
        forbidden();
    }

    const params = await searchParams;
    const { request, data } = await searchUsers(params);
    return <SearchUsers data={data} request={request} />;
}
