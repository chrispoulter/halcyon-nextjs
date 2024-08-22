import { useQuery } from '@tanstack/react-query';
import { GetProfileResponse } from '@/features/manage/manageTypes';
import { fetcher } from '@/utils/fetch';
import { config } from '@/utils/config';

export const getProfile = () =>
    fetcher<GetProfileResponse>(`${config.API_URL}/manage`);

export const useGetProfile = () => {
    const { data } = useQuery({
        queryKey: ['profile'],
        queryFn: () => getProfile()
    });

    return { profile: data };
};
