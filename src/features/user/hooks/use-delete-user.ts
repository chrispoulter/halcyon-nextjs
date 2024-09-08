import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { UpdatedResponse } from '@/features/common/commonTypes';
import { DeleteUserRequest } from '@/features/user/userTypes';
import { fetcher } from '@/lib/fetch';
import { config } from '@/lib/config';

const deleteUser = (
    id: string,
    request: DeleteUserRequest,
    init?: RequestInit
) =>
    fetcher<UpdatedResponse>(`${config.API_URL}/user/${id}`, {
        ...init,
        method: 'DELETE',
        body: JSON.stringify(request)
    });

export const useDeleteUser = (id: string) => {
    const { data: session } = useSession();

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: DeleteUserRequest) =>
            deleteUser(id, request, {
                headers: { Authorization: `Bearer ${session?.accessToken}` }
            }),
        onSuccess: data => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            queryClient.invalidateQueries({ queryKey: ['users'] });

            queryClient.invalidateQueries({
                queryKey: ['user', data.id],
                refetchType: 'none'
            });
        }
    });
};
