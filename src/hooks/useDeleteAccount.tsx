import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '@/utils/fetch';
import { UpdatedResponse } from '@/utils/handler';

export const deleteAccount = () =>
    fetcher<UpdatedResponse>('/api/manage', { method: 'DELETE' });

export const useDeleteAccount = () => {
    const queryClient = useQueryClient();

    const { mutateAsync, isLoading } = useMutation({
        mutationFn: deleteAccount,
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['profile'] })
    });

    return { deleteAccount: mutateAsync, isDeleting: isLoading };
};
