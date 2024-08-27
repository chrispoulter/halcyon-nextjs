import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { UpdatedResponse } from '@/features/common/commonTypes';
import { LockUserRequest } from '@/features/user/userTypes';
import { fetcher } from '@/utils/fetch';
import { config } from '@/utils/config';

const lockUser = (id: string, request: LockUserRequest, init?: RequestInit) =>
    fetcher<UpdatedResponse>(`${config.API_URL}/user/${id}/lock`, {
        ...init,
        method: 'PUT',
        body: JSON.stringify(request)
    });

export const useLockUser = (id: string) => {
    const { data: session } = useSession();

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: LockUserRequest) =>
            lockUser(id, request, {
                headers: { Authorization: `Bearer ${session?.accessToken}` }
            }),
        onSuccess: data => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user', data.id] });
        }
    });
};
