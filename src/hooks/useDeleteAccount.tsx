import { useMutation, useQueryClient } from '@tanstack/react-query';
import ky from 'ky';
import { HandlerResponse, UpdatedResponse } from '@/utils/handler';

const deleteAccount = () =>
    ky
        .delete('manage', { prefixUrl: '/api' })
        .json<HandlerResponse<UpdatedResponse>>();

export const useDeleteAccount = () => {
    const queryClient = useQueryClient();

    const { mutateAsync, isLoading } = useMutation({
        mutationFn: deleteAccount,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['profile'],
                refetchType: 'none'
            })
    });

    return { deleteAccount: mutateAsync, isDeleting: isLoading };
};
