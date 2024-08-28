import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { UpdatedResponse } from '@/features/common/commonTypes';
import { UnlockUserRequest } from '@/features/user/userTypes';
import { fetcher } from '@/utils/fetch';
import { config } from '@/utils/config';

const unlockUser = (
    id: string,
    request: UnlockUserRequest,
    init?: RequestInit
) =>
    fetcher<UpdatedResponse>(`${config.API_URL}/user/${id}/unlock`, {
        ...init,
        method: 'PUT',
        body: JSON.stringify(request)
    });

export const useUnlockUser = (id: string) => {
    const { data: session } = useSession();

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: UnlockUserRequest) =>
            unlockUser(id, request, {
                headers: { Authorization: `Bearer ${session?.accessToken}` }
            }),
        onSuccess: data => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user', data.id] });
        }
    });
};
