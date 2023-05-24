import { useQuery } from '@tanstack/react-query';
import ky, { Options } from 'ky';
import { GetUserResponse } from '@/models/user.types';
import { HandlerResponse } from '@/utils/handler';

export const getUser = (id: string, options?: Options, baseUrl = '') =>
    ky
        .get(`user/${id}`, { ...options, prefixUrl: `${baseUrl}/api` })
        .json<HandlerResponse<GetUserResponse>>();

export const useGetUser = (id: string) => {
    const { data } = useQuery({
        queryKey: ['user', id],
        queryFn: () => getUser(id),
        enabled: !!id
    });

    return { user: data?.data };
};
