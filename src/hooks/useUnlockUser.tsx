import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UnlockUserRequest } from '@/models/user.types';
import { fetcher } from '@/utils/fetch';
import { UpdatedResponse } from '@/utils/handler';

const unlockUser = (id: string, request: UnlockUserRequest) =>
    fetcher<UpdatedResponse>(`/api/user/${id}/unlock`, {
        method: 'PUT',
        body: JSON.stringify(request)
    });

export const useUnlockUser = (id: string) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isLoading } = useMutation({
        mutationFn: (request: UnlockUserRequest) => unlockUser(id, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user', id] });
        }
    });

    return { unlockUser: mutateAsync, isUnlocking: isLoading };
};
