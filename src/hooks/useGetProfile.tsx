import { useQuery } from '@tanstack/react-query';
import ky, { Options } from 'ky-universal';
import { GetProfileResponse } from '@/models/manage.types';
import { HandlerResponse } from '@/utils/handler';

export const getProfile = (options?: Options, baseUrl = '') =>
    ky
        .get('manage', { ...options, prefixUrl: `${baseUrl}/api` })
        .json<HandlerResponse<GetProfileResponse>>();

export const useGetProfile = () => {
    const { data } = useQuery({
        queryKey: ['profile'],
        queryFn: () => getProfile()
    });

    return { profile: data?.data };
};
