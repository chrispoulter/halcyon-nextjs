import { useQuery } from '@tanstack/react-query';
import { Role } from '@/utils/auth';
import { fetcher } from '@/utils/fetch';
import { config } from '@/utils/config';

export type GetUserResponse = {
    id: string;
    emailAddress: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    isLockedOut?: boolean;
    roles?: Role[];
    version: number;
};

export const getUser = (id: string, init?: RequestInit) =>
    fetcher<GetUserResponse>(`${config.API_URL}/user/${id}`, init);

export const useGetUser = (id: string) => {
    const { data, isFetching } = useQuery({
        queryKey: ['user', id],
        queryFn: () => getUser(id),
        enabled: !!id
    });

    return { user: data?.data, isFetching };
};
