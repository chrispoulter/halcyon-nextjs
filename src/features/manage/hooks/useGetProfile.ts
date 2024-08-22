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

export const getProfile = () =>
    fetcher<GetProfileResponse>(`${config.API_URL}/manage`);

export const useGetProfile = () => {
    const { data } = useQuery({
        queryKey: ['profile'],
        queryFn: () => getProfile()
    });

    return { profile: data };
};
