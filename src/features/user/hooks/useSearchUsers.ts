import { useQuery } from '@tanstack/react-query';
import {
    SearchUsersRequest,
    SearchUsersResponse
} from '@/features/user/userTypes';
import { fetchWithToken } from '@/utils/fetch';
import { config } from '@/utils/config';

export const searchUsers = (
    request: SearchUsersRequest,
    init?: RequestInit
) => {
    const params = Object.entries(request)
        .map(pair => pair.map(encodeURIComponent).join('='))
        .join('&');

    return fetchWithToken<SearchUsersResponse>(
        `${config.API_URL}/user?${params}`,
        init
    );
};

export const useSearchUsers = (request: SearchUsersRequest) => {
    const { data, isFetching, isLoading, isError } = useQuery({
        queryKey: ['users', request],
        queryFn: () => searchUsers(request)
    });

    return {
        isFetching,
        isLoading: isLoading || isError,
        ...data
    };
};
