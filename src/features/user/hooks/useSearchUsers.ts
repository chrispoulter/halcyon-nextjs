import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import {
    SearchUsersRequest,
    SearchUsersResponse
} from '@/features/user/userTypes';
import { fetcher } from '@/utils/fetch';
import { config } from '@/utils/config';

export const searchUsers = (
    request: SearchUsersRequest,
    init?: RequestInit
) => {
    const params = Object.entries(request)
        .map(pair => pair.map(encodeURIComponent).join('='))
        .join('&');

    return fetcher<SearchUsersResponse>(
        `${config.API_URL}/user?${params}`,
        init
    );
};

export const useSearchUsers = (request: SearchUsersRequest) => {
    const { data: session, status } = useSession();

    return useQuery({
        queryKey: ['users', request],
        queryFn: () =>
            searchUsers(request, {
                headers: { Authorization: `Bearer ${session?.accessToken}` }
            }),
        enabled: status !== 'loading'
    });
};
