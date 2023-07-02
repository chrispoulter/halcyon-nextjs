import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LockUserRequest } from '@/models/user.types';
import { fetcher } from '@/utils/fetch';
import { UpdatedResponse } from '@/utils/handler';

const lockUser = (id: string, request: LockUserRequest) =>
    fetcher<UpdatedResponse>(`/api/user/${id}/lock`, {
        method: 'PUT',
        body: JSON.stringify(request)
    });

export const useLockUser = (id: string) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isLoading } = useMutation({
        mutationFn: (request: LockUserRequest) => lockUser(id, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user', id] });
        }
    });

    return { lockUser: mutateAsync, isLocking: isLoading };
};
