import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/utils/fetch';
import { config } from '@/utils/config';

export type GetProfileResponse = {
    id: string;
    emailAddress: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    version: number;
};

export const getProfile = (init?: RequestInit) =>
    fetcher<GetProfileResponse>(`${config.API_URL}/manage`, init);

export const useGetProfile = () => {
    const { data } = useQuery({
        queryKey: ['profile'],
        queryFn: () => getProfile()
    });

    return { profile: data?.data };
};
