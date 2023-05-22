import useSWRMutation from 'swr/mutation';
import { fetcher } from '@/utils/fetch';

const deleteAccount = async (url: string) =>
    fetcher(url, {
        method: 'DELETE'
    });

export const useDeleteAccount = () => {
    const { trigger, isMutating } = useSWRMutation(
        '/api/manage',
        deleteAccount,
        {
            revalidate: false
        }
    );

    return { deleteAccount: trigger, isDeleting: isMutating };
};
