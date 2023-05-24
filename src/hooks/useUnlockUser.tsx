import { useMutation, useQueryClient } from '@tanstack/react-query';
import ky from 'ky';
import { HandlerResponse, UpdatedResponse } from '@/utils/handler';

export const unlockUser = (id: string) =>
    ky
        .put(`user/${id}/unlock`, { prefixUrl: '/api' })
        .json<HandlerResponse<UpdatedResponse>>();

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
