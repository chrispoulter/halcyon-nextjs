import { useMutation, useQueryClient } from '@tanstack/react-query';
import ky from 'ky';
import { HandlerResponse, UpdatedResponse } from '@/utils/handler';

const deleteUser = (id: string) =>
    ky.delete(`/api/user/${id}`).json<HandlerResponse<UpdatedResponse>>();

export const useDeleteUser = (id: string) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isLoading } = useMutation({
        mutationFn: () => deleteUser(id),
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
