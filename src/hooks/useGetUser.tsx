import useSWR from 'swr';
import { GetUserResponse } from '@/models/user.types';
import { fetcher } from '@/utils/fetch';

export const useGetUser = (id: string) => {
    const { data } = useSWR(id ? `/api/user/${id}` : null, url =>
        fetcher<GetUserResponse>(url)
    );

    return { user: data?.data };
};
