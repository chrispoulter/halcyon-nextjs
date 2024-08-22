import { useInfiniteQuery } from '@tanstack/react-query';
import {
    SearchUsersRequest,
    SearchUsersResponse
} from '@/features/user/userTypes';
import { fetchWithToken } from '@/utils/fetch';
import { config } from '@/utils/config';

export const searchUsers = (request: SearchUsersRequest) => {
    const params = Object.entries(request)
        .map(pair => pair.map(encodeURIComponent).join('='))
        .join('&');

    return fetchWithToken<SearchUsersResponse>(
        `${config.API_URL}/user?${params}`
    );
};

type UseSearchUsersProps = Omit<SearchUsersRequest, 'page'>;

export const useSearchUsers = (request: UseSearchUsersProps) => {
    const { data, fetchNextPage, isLoading, isFetching, isError, hasNextPage } =
        useInfiniteQuery({
            queryKey: ['users', request],
            queryFn: ({ pageParam }) =>
                searchUsers({ ...request, page: pageParam }),
            initialPageParam: 1,
            getNextPageParam: (lastPage, pages) =>
                lastPage.hasNextPage ? pages.length + 1 : undefined
        });

    return {
        isLoading: isLoading || isError,
        isFetching,
        users: data?.pages?.map(response => response?.items || []).flat(),
        hasNextPage,
        fetchNextPage
    };
};
