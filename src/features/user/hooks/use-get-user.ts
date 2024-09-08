import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { GetUserResponse } from '@/features/user/user-types';
import { fetcher } from '@/lib/fetch';
import { config } from '@/lib/config';

export const getUser = (id: string, init?: RequestInit) =>
    fetcher<GetUserResponse>(`${config.API_URL}/user/${id}`, init);

export const useGetUser = (id: string, enabled = true) => {
    const { data: session, status } = useSession();
    const loading = status === 'loading';

    return useQuery({
        queryKey: ['user', id],
        queryFn: () =>
            getUser(id, {
                headers: { Authorization: `Bearer ${session?.accessToken}` }
            }),
        enabled: enabled && !loading
    });
};
