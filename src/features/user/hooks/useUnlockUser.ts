import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdatedResponse } from '@/features/common/commonTypes';
import { UnlockUserRequest } from '@/features/user/userTypes';
import { fetchWithToken } from '@/utils/fetch';
import { config } from '@/utils/config';

const unlockUser = (id: string, request: UnlockUserRequest) =>
    fetchWithToken<UpdatedResponse>(`${config.API_URL}/user/${id}/unlock`, {
        method: 'PUT',
        body: JSON.stringify(request)
    });

export const useUnlockUser = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: UnlockUserRequest) => unlockUser(id, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user', id] });
        }
    });
};
