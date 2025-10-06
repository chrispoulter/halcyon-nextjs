import type { Metadata } from 'next';
import { redirect, forbidden } from 'next/navigation';
import { z } from 'zod';
import { searchUsers } from '@/app/user/data/search-users';
import { SearchUsers } from '@/app/user/search-users';
import { isUserAdministrator } from '@/lib/definitions';
import { getSession } from '@/lib/session';

export const metadata: Metadata = {
    title: 'Users',
};

const searchParamsSchema = z.object({
    search: z.string({ message: 'Search must be a valid string' }).catch(''),
    page: z.coerce
        .number({ message: 'Page must be a valid number' })
        .int('Page must be a valid integer')
        .positive('Page must be a postive number')
        .catch(1),
    sort: z
        .enum(
            [
                'EMAIL_ADDRESS_ASC',
                'EMAIL_ADDRESS_DESC',
                'NAME_ASC',
                'NAME_DESC',
            ],
            {
                message: 'Sort must be a valid user sort',
            }
        )
        .catch('NAME_ASC'),
});

const PAGE_SIZE = 5;

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
    const request = searchParamsSchema.parse(params);
    const data = await searchUsers({ ...request, size: PAGE_SIZE });

    return <SearchUsers data={data} request={request} />;
}
