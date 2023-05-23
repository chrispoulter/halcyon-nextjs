import { useQuery } from '@tanstack/react-query';
import { GetProfileResponse } from '@/models/manage.types';
import { fetcher } from '@/utils/fetch';

export const getProfile = (init?: RequestInit) =>
    fetcher<GetProfileResponse>('/api/manage', init);

export const useGetProfile = () => {
    const { data } = useQuery({
        queryKey: ['profile'],
        queryFn: getProfile
    });

    return { profile: data?.data };
};
