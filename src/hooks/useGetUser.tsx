import { useQuery } from '@tanstack/react-query';
import { GetUserResponse } from '@/models/user.types';
import { fetcher } from '@/utils/fetch';

export const getUser = (id: string) =>
    fetcher<GetUserResponse>(`/api/user/${id}`);

export const useGetUser = (id: string) => {
    const { data } = useQuery({
        queryKey: ['user', id],
        queryFn: () => getUser(id),
        enabled: !!id
    });

    return { user: data?.data };
};
