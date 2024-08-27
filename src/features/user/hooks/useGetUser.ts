import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { GetUserResponse } from '@/features/user/userTypes';
import { fetcher } from '@/utils/fetch';
import { config } from '@/utils/config';

export const getUser = (id: string, init?: RequestInit) =>
    fetcher<GetUserResponse>(`${config.API_URL}/user/${id}`, init);

export const useGetUser = (id: string) => {
    const { data: session, status } = useSession();

    return useQuery({
        queryKey: ['user', id],
        queryFn: () =>
            getUser(id, {
                headers: { Authorization: `Bearer ${session?.accessToken}` }
            }),
        enabled: !!id && status !== 'loading'
    });
};
