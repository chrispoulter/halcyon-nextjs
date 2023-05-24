import { useQuery } from '@tanstack/react-query';
import ky, { Options } from 'ky';
import { GetProfileResponse } from '@/models/manage.types';
import { HandlerResponse } from '@/utils/handler';

export const getProfile = (options?: Options, prefixUrl = '') =>
    ky
        .get('api/manage', { prefixUrl, ...options })
        .json<HandlerResponse<GetProfileResponse>>();

export const useGetProfile = () => {
    const { data } = useQuery({
        queryKey: ['profile'],
        queryFn: () => getProfile()
    });

    return { profile: data?.data };
};
