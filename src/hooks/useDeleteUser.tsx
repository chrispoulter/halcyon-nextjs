import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '@/utils/fetch';
import { UpdatedResponse } from '@/utils/handler';

export const deleteUser = (id: string) =>
    fetcher<UpdatedResponse>(`/api/user/${id}`, { method: 'DELETE' });

export const useDeleteUser = (id: string) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isLoading } = useMutation({
        mutationFn: () => deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user', id] });
        }
    });

    return { deleteUser: mutateAsync, isDeleting: isLoading };
};
