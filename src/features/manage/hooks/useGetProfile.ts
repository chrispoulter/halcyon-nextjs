import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { GetProfileResponse } from '@/features/manage/manageTypes';
import { fetcher } from '@/utils/fetch';
import { config } from '@/utils/config';

export const getProfile = (init?: RequestInit) =>
    fetcher<GetProfileResponse>(`${config.API_URL}/manage`, init);

export const useGetProfile = () => {
    const { data: session, status } = useSession();
    const loading = status === 'loading';

    return useQuery({
        queryKey: ['profile'],
        queryFn: () =>
            getProfile({
                headers: { Authorization: `Bearer ${session?.accessToken}` }
            }),
        enabled: !loading
    });
};
