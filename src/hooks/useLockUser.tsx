import { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';
import toast from 'react-hot-toast';
import { fetcher } from '@/utils/fetch';
import { HandlerResponse } from '@/utils/handler';

const lockUser = async (url: string) => fetcher(url, { method: 'PUT' });

export const useLockUser = (id: string) => {
    const { trigger, isMutating } = useSWRMutation<HandlerResponse>(
        `/api/user/${id}/lock`,
        lockUser,
        {
            onSuccess: data => {
                toast.success(data.message!);
                mutate(`/api/user/${id}`);
            }
        }
    );

    return { lockUser: trigger, isLocking: isMutating };
};
