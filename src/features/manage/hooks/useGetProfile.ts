import { useQuery } from '@tanstack/react-query';
import { GetProfileResponse } from '@/features/manage/manageTypes';
import { fetchWithToken } from '@/utils/fetch';
import { config } from '@/utils/config';

export const getProfile = (init?: RequestInit) =>
    fetchWithToken<GetProfileResponse>(`${config.API_URL}/manage`, init);

export const useGetProfile = () => {
    const { data } = useQuery({
        queryKey: ['profile'],
        queryFn: getProfile
    });

    return { profile: data };
};
