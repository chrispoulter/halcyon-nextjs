import useSWR from 'swr';
import { GetUserResponse } from '@/models/user.types';
import { HandlerResponse } from '@/utils/handler';

export const useGetUser = (id: string) => {
    const { data } = useSWR<HandlerResponse<GetUserResponse>>(
        id ? `/api/user/${id}` : null
    );

    return { user: data?.data };
};
