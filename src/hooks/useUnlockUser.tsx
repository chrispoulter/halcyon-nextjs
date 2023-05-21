import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '@/utils/fetch';
import { UpdatedResponse } from '@/utils/handler';

export const unlockUser = (id: string) =>
    fetcher<UpdatedResponse>(`/api/user/${id}/unlock`, 'PUT');

export const useUnlockUser = (id: string) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isLoading } = useMutation({
        mutationFn: () => unlockUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user', id] });
        }
    });

    return { unlockUser: mutateAsync, isUnlocking: isLoading };
};
