import type { Metadata } from 'next';
import { z } from 'zod';
import { searchUsers } from '@/app/users/data/search-users';
import { SearchUsers } from '@/app/users/search-users';
import { verifySession } from '@/lib/dal';
import { isUserAdministrator } from '@/lib/definitions';

const searchParamsSchema = z.object({
    search: z.string({ message: 'Search must be a valid string' }).catch(''),
    page: z.coerce
        .number({ message: 'Page must be a valid number' })
        .int('Page must be a valid integer')
        .positive('Page must be a positive number')
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

export const metadata: Metadata = {
    title: 'Users',
};

export default async function SearchUsersPage({
    searchParams,
}: PageProps<'/users'>) {
    await verifySession(isUserAdministrator);

    const params = await searchParams;
    const request = searchParamsSchema.parse(params);
    const data = await searchUsers(request);
    return <SearchUsers data={data} request={request} />;
}
