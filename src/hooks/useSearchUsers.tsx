import { useInfiniteQuery } from '@tanstack/react-query';
import ky, { Options } from 'ky';
import { SearchUsersRequest, SearchUsersResponse } from '@/models/user.types';
import { HandlerResponse } from '@/utils/handler';

const PAGE_SIZE = 5;

export const searchUsers = (
    searchParams: SearchUsersRequest,
    options?: Options,
    prefixUrl = ''
) =>
    ky
        .get('api/user', { prefixUrl, searchParams, ...options })
        .json<HandlerResponse<SearchUsersResponse>>();

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
