import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdatedResponse } from '@/features/common/commonTypes';
import { UpdateUserRequest } from '@/features/user/userTypes';
import { fetchWithToken } from '@/utils/fetch';
import { config } from '@/utils/config';

const updateUser = (id: string, request: UpdateUserRequest) =>
    fetchWithToken<UpdatedResponse>(`${config.API_URL}/user/${id}`, {
        method: 'PUT',
        body: JSON.stringify(request)
    });

export const useUpdateUser = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: UpdateUserRequest) => updateUser(id, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user', id] });
        }
    });
};
