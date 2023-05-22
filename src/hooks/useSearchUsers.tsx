import { useInfiniteQuery } from '@tanstack/react-query';
import { SearchUsersRequest, SearchUsersResponse } from '@/models/user.types';
import { fetcher } from '@/utils/fetch';

type UseSearchUsersProps = Omit<SearchUsersRequest, 'page' | 'size'>;

const searchUsers = (request: SearchUsersRequest) => {
    const params = Object.entries(request)
        .map(pair => pair.map(encodeURIComponent).join('='))
        .join('&');

    return fetcher<SearchUsersResponse>(`/api/user?${params}`);
};

export const useSearchUsers = (request: UseSearchUsersProps) => {
    const { data, error, fetchNextPage, isLoading, isFetching } =
        useInfiniteQuery({
            queryKey: ['users', request],
            queryFn: ({ pageParam = 1 }) =>
                searchUsers({ ...request, page: pageParam, size: 5 })
        });

    const users = data?.pages
        ?.map(response => response.data?.items || [])
        .flat();

    const hasMore = data?.pages[data?.pages?.length - 1]?.data?.hasNextPage;

    const loadMore = () =>
        fetchNextPage({ pageParam: (data?.pages?.length || 0) + 1 });

    return {
        isLoading: isLoading || !!error,
        isFetching,
        users,
        hasMore,
        loadMore
    };
};
