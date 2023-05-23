import { useInfiniteQuery } from '@tanstack/react-query';
import { SearchUsersRequest, SearchUsersResponse } from '@/models/user.types';
import { fetcher } from '@/utils/fetch';

const PAGE_SIZE = 5;

export const searchUsers = (
    request: SearchUsersRequest,
    init?: RequestInit,
    baseUrl = ''
) => {
    const params = Object.entries(request)
        .map(pair => pair.map(encodeURIComponent).join('='))
        .join('&');

    return fetcher<SearchUsersResponse>(`${baseUrl}/api/user?${params}`, init);
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
        users: data?.pages?.map(response => response.data?.items || []).flat(),
        hasMore: hasNextPage,
        loadMore: fetchNextPage
    };
};
