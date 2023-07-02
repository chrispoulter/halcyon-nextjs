import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DeleteUserRequest } from '@/models/user.types';
import { fetcher } from '@/utils/fetch';
import { UpdatedResponse } from '@/utils/handler';

const deleteUser = (id: string, request: DeleteUserRequest) =>
    fetcher<UpdatedResponse>(`/api/user/${id}`, {
        method: 'DELETE',
        body: JSON.stringify(request)
    });

export const useDeleteUser = (id: string) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isLoading } = useMutation({
        mutationFn: (request: DeleteUserRequest) => deleteUser(id, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });

            queryClient.invalidateQueries({
                queryKey: ['user', id],
                refetchType: 'none'
            });
        }
    });

    return { deleteUser: mutateAsync, isDeleting: isLoading };
};
