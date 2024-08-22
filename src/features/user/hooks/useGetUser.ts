import { useQuery } from '@tanstack/react-query';
import { GetUserResponse } from '@/features/user/userTypes';
import { fetcher } from '@/utils/fetch';
import { config } from '@/utils/config';

export const getUser = (id: string) =>
    fetcher<GetUserResponse>(`${config.API_URL}/user/${id}`);

export const useGetUser = (id: string) => {
    const { data, isFetching } = useQuery({
        queryKey: ['user', id],
        queryFn: () => getUser(id),
        enabled: !!id
    });

    return { user: data, isFetching };
};
