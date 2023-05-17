import useSWRMutation from 'swr/mutation';
import { fetcher } from '@/utils/fetch';

const deleteUser = async (url: string) => fetcher(url, 'DELETE');

export const useDeleteUser = (id: string) => {
    const { trigger, isMutating } = useSWRMutation(
        `/api/user/${id}`,
        deleteUser,
        {
            revalidate: false
        }
    );

    return { deleteUser: trigger, isDeleting: isMutating };
};
