import useSWRInfinite from 'swr/infinite';
import { SearchUsersRequest, SearchUsersResponse } from '@/models/user.types';
import { fetcher } from '@/utils/fetch';

type UseSearchUsersProps = Omit<SearchUsersRequest, 'page' | 'size'>;

export const useSearchUsers = (request: UseSearchUsersProps) => {
    const params = Object.entries(request)
        .map(pair => pair.map(encodeURIComponent).join('='))
        .join('&');

    const getKey = (index: number) =>
        `/api/user?${params}&page=${index + 1}&size=5`;

    const {
        data = [],
        isLoading,
        isValidating,
        size,
        setSize,
        error
    } = useSWRInfinite(getKey, url => fetcher<SearchUsersResponse>(url), {
        revalidateAll: true,
        parallel: true
    });

    const users = data?.map(response => response.data?.items || []).flat();

    const hasMore = data[data.length - 1]?.data?.hasNextPage;

    const loadMore = () => setSize(size + 1);

    return {
        isLoading: isLoading || !!error,
        isFetching: isValidating,
        users,
        hasMore,
        loadMore
    };
};
