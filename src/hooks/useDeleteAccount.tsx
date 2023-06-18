import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DeleteAccountRequst } from '@/models/manage.types';
import { fetcher } from '@/utils/fetch';
import { UpdatedResponse } from '@/utils/handler';

const deleteAccount = (request: DeleteAccountRequst) =>
    fetcher<UpdatedResponse>('/api/manage', {
        method: 'DELETE',
        body: JSON.stringify(request)
    });

export const useDeleteAccount = () => {
    const queryClient = useQueryClient();

    const { mutateAsync, isLoading } = useMutation({
        mutationFn: (request: DeleteAccountRequst) => deleteAccount(request),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['profile'],
                refetchType: 'none'
            })
    });

    return { deleteAccount: mutateAsync, isDeleting: isLoading };
};
