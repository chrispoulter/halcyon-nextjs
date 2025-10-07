import type { Metadata } from 'next';
import { searchUsers } from '@/app/user/data/search-users';
import { SearchUsers } from '@/app/user/search-users';
import { isUserAdministrator } from '@/lib/definitions';
import { ensureAuthorized } from '@/lib/permissions';

export const metadata: Metadata = {
    title: 'Users',
};

export default async function SearchUsersPage({
    searchParams,
}: PageProps<'/user'>) {
    await ensureAuthorized(isUserAdministrator);

    const params = await searchParams;
    const { request, data } = await searchUsers(params);
    return <SearchUsers data={data} request={request} />;
}
