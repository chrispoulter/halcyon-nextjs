import type { Metadata } from 'next';
import { z } from 'zod';
import { searchUsersAction } from '@/app/user/actions/search-users-action';
import { SearchUsers } from '@/app/user/search-users';
import { UserSort } from '@/app/user/user-types';
import {
    isServerActionSuccess,
    ServerActionError,
} from '@/components/server-action-error';

type SearchUsersPageProps = {
    searchParams: Promise<{
        page?: number;
        sort: string;
        search: string;
    }>;
};

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
        .nativeEnum(UserSort, {
            message: 'Sort must be a valid user sort',
        })
        .catch(UserSort.NAME_ASC),
});

const PAGE_SIZE = 5;

export default async function SearchUsersPage({
    searchParams,
}: SearchUsersPageProps) {
    const params = await searchParams;

    const request = searchParamsSchema.parse(params);

    const result = await searchUsersAction({
        ...request,
        size: PAGE_SIZE,
    });

    if (!isServerActionSuccess(result)) {
        return <ServerActionError result={result} />;
    }

    return <SearchUsers data={result.data} request={request} />;
}
