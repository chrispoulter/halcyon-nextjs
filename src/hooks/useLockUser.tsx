import { useMutation, useQueryClient } from '@tanstack/react-query';
import ky from 'ky';
import { HandlerResponse, UpdatedResponse } from '@/utils/handler';

export const lockUser = (id: string) =>
    ky.put(`/api/user/${id}/lock`).json<HandlerResponse<UpdatedResponse>>();

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
