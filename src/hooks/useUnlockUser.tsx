import { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';
import toast from 'react-hot-toast';
import { fetcher } from '@/utils/fetch';
import { HandlerResponse } from '@/utils/handler';

const unlockUser = async (url: string) => fetcher(url, { method: 'PUT' });

export const useUnlockUser = (id: string) => {
    const { trigger, isMutating } = useSWRMutation<HandlerResponse>(
        `/api/user/${id}/unlock`,
        unlockUser,
        {
            onSuccess: data => {
                toast.success(data.message!);
                mutate(`/api/user/${id}`);
            }
        }
    );

    return { unlockUser: trigger, isUnlocking: isMutating };
};
