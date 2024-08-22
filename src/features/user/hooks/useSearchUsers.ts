import { useInfiniteQuery } from '@tanstack/react-query';
import { Role } from '@/utils/auth';
import { fetcher } from '@/utils/fetch';
import { config } from '@/utils/config';

export enum UserSort {
    EMAIL_ADDRESS_ASC = 'EMAIL_ADDRESS_ASC',
    EMAIL_ADDRESS_DESC = 'EMAIL_ADDRESS_DESC',
    NAME_ASC = 'NAME_ASC',
    NAME_DESC = 'NAME_DESC'
}

export type SearchUsersRequest = {
    search?: string;
    sort: UserSort;
    page: number;
    size: number;
};

export type SearchUserResponse = {
    id: string;
    emailAddress: string;
    firstName: string;
    lastName: string;
    isLockedOut?: boolean;
    roles?: Role[];
};

export type SearchUsersResponse = {
    items?: SearchUserResponse[];
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
};

const PAGE_SIZE = 5;

export const searchUsers = (request: SearchUsersRequest) => {
    const params = Object.entries(request)
        .map(pair => pair.map(encodeURIComponent).join('='))
        .join('&');

    return fetcher<SearchUsersResponse>(`${config.API_URL}/user?${params}`);
};

type UseSearchUsersProps = Omit<SearchUsersRequest, 'page' | 'size'>;

export const useSearchUsers = (request: UseSearchUsersProps) => {
    const { data, fetchNextPage, isLoading, isFetching, isError, hasNextPage } =
        useInfiniteQuery({
            queryKey: ['users', request],
            queryFn: ({ pageParam = 1 }) =>
                searchUsers({ ...request, page: pageParam, size: PAGE_SIZE }),
            getNextPageParam: (lastPage, pages) =>
                lastPage.data?.hasNextPage ? pages.length + 1 : undefined
        });

    return {
        isLoading: isLoading || isError,
        isFetching,
        users: data?.pages?.map(response => response?.items || []).flat(),
        hasMore: hasNextPage,
        loadMore: fetchNextPage
    };
};
