import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdatedResponse } from '@/features/common/commonTypes';
import { ChangePasswordRequest } from '@/features/manage/manageTypes';
import { fetchWithToken } from '@/utils/fetch';
import { config } from '@/utils/config';

const changePassword = (request: ChangePasswordRequest) =>
    fetchWithToken<UpdatedResponse>(
        `${config.API_URL}/manage/change-password`,
        {
            method: 'PUT',
            body: JSON.stringify(request)
        }
    );

export const useChangePassword = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: changePassword,
        onSuccess: data => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user', data.id] });
        }
    });
};
