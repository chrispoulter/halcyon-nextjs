import useSWR from 'swr';
import { GetProfileResponse } from '@/models/manage.types';
import { HandlerResponse } from '@/utils/handler';

export const useGetProfile = () => {
    const { data } = useSWR<HandlerResponse<GetProfileResponse>>('/api/manage');

    return { profile: data?.data };
};
