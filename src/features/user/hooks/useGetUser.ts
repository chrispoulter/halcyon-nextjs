import { useQuery } from '@tanstack/react-query';
import { GetUserResponse } from '@/features/user/userTypes';
import { fetchWithToken } from '@/utils/fetch';
import { config } from '@/utils/config';

export const getUser = (id: string, init?: RequestInit) =>
    fetchWithToken<GetUserResponse>(`${config.API_URL}/user/${id}`, init);

export const useGetUser = (id: string) =>
    useQuery({
        queryKey: ['user', id],
        queryFn: () => getUser(id),
        enabled: !!id
    });
