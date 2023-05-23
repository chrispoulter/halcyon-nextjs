import { useQuery } from '@tanstack/react-query';
import { GetUserResponse } from '@/models/user.types';
import { fetcher } from '@/utils/fetch';

export const getUser = (id: string, init?: RequestInit) =>
    fetcher<GetUserResponse>(`/api/user/${id}`, init);

export const useGetUser = (id: string) => {
    const { data } = useQuery({
        queryKey: ['user', id],
        queryFn: () => getUser(id),
        enabled: !!id
    });

    return { user: data?.data };
};
