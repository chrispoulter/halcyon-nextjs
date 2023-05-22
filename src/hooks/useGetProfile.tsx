import useSWR from 'swr';
import { GetProfileResponse } from '@/models/manage.types';
import { fetcher } from '@/utils/fetch';

export const useGetProfile = () => {
    const { data } = useSWR('/api/manage', url =>
        fetcher<GetProfileResponse>(url)
    );

    return { profile: data?.data };
};
