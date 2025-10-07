import type { Metadata } from 'next';
import { searchUsers } from '@/app/user/data/search-users';
import { SearchUsers } from '@/app/user/search-users';
import { verifySession } from '@/lib/dal';
import { isUserAdministrator } from '@/lib/definitions';

export const metadata: Metadata = {
    title: 'Users',
};

export default async function SearchUsersPage({
    searchParams,
}: PageProps<'/user'>) {
    await verifySession(isUserAdministrator);

    const params = await searchParams;
    const { request, data } = await searchUsers(params);
    return <SearchUsers data={data} request={request} />;
}
