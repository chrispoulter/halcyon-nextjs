import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdatedResponse } from '@/features/common/commonTypes';
import { LockUserRequest } from '@/features/user/userTypes';
import { fetchWithToken } from '@/utils/fetch';
import { config } from '@/utils/config';

const lockUser = (id: string, request: LockUserRequest) =>
    fetchWithToken<UpdatedResponse>(`${config.API_URL}/user/${id}/lock`, {
        method: 'PUT',
        body: JSON.stringify(request)
    });

export const useLockUser = (id: string) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (request: LockUserRequest) => lockUser(id, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user', id] });
        }
    });

    return { lockUser: mutateAsync, isLocking: isPending };
};
