import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '@/utils/fetch';
import { UpdatedResponse } from '@/utils/handler';

const lockUser = (id: string) =>
    fetcher<UpdatedResponse>(`/api/user/${id}/lock`, { method: 'PUT' });

export const useLockUser = (id: string) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isLoading } = useMutation({
        mutationFn: () => lockUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user', id] });
        }
    });

    return { lockUser: mutateAsync, isLocking: isLoading };
};
