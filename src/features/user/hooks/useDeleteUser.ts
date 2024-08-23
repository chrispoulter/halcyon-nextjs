import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdatedResponse } from '@/features/common/commonTypes';
import { DeleteUserRequest } from '@/features/user/userTypes';
import { fetchWithToken } from '@/utils/fetch';
import { config } from '@/utils/config';

const deleteUser = (id: string, request: DeleteUserRequest) =>
    fetchWithToken<UpdatedResponse>(`${config.API_URL}/user/${id}`, {
        method: 'DELETE',
        body: JSON.stringify(request)
    });

export const useDeleteUser = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: DeleteUserRequest) => deleteUser(id, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });

            queryClient.invalidateQueries({
                queryKey: ['user', id],
                refetchType: 'none'
            });
        }
    });
};
