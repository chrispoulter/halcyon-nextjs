import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { UpdatedResponse } from '@/features/common/common-types';
import { UpdateUserRequest } from '@/features/user/user-types';
import { fetcher } from '@/lib/fetch';
import { config } from '@/lib/config';

const updateUser = (
    id: string,
    request: UpdateUserRequest,
    init?: RequestInit
) =>
    fetcher<UpdatedResponse>(`${config.API_URL}/user/${id}`, {
        ...init,
        method: 'PUT',
        body: JSON.stringify(request)
    });

export const useUpdateUser = (id: string) => {
    const { data: session } = useSession();

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: UpdateUserRequest) =>
            updateUser(id, request, {
                headers: { Authorization: `Bearer ${session?.accessToken}` }
            }),
        onSuccess: data => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user', data.id] });
        }
    });
};
