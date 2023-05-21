import { useInfiniteQuery } from '@tanstack/react-query';
import { SearchUsersRequest, SearchUsersResponse } from '@/models/user.types';
import { fetcher } from '@/utils/fetch';

type UseSearchUsersProps = Omit<SearchUsersRequest, 'page' | 'size'>;

const searchUsers = (page = 1, request: UseSearchUsersProps) => {
    const params = Object.entries(request)
        .map(pair => pair.map(encodeURIComponent).join('='))
        .join('&');

    return fetcher<SearchUsersResponse>(
        `/api/user?${params}&page=${page}&size=5`
    );
};

export const useSearchUsers = (request: UseSearchUsersProps) => {
    const { data, error, fetchNextPage, isLoading, isFetching } =
        useInfiniteQuery({
            queryKey: ['users', request],
            queryFn: ({ pageParam }) => searchUsers(pageParam, request)
        });

    const lastResponse = data?.pages[data?.pages.length - 1];

    const mergedData = {
        code: lastResponse?.code,
        message: lastResponse?.message,
        data: {
            items: data?.pages
                ?.map(response => response.data?.items || [])
                .flat(),
            hasNextPage: lastResponse?.data?.hasNextPage
        }
    };

    const nextPageParam = (data?.pages.length || 0) + 1;

    return {
        isLoading: isLoading || !!error,
        isFetching,
        users: mergedData?.data?.items,
        hasMore: mergedData?.data?.hasNextPage,
        loadMore: () => fetchNextPage({ pageParam: nextPageParam })
    };
};
