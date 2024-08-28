import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdatedResponse } from '@/features/common/commonTypes';
import { ResetPasswordRequest } from '@/features/account/accountTypes';
import { fetcher } from '@/utils/fetch';
import { config } from '@/utils/config';

const resetPassword = (request: ResetPasswordRequest) =>
    fetcher<UpdatedResponse>(`${config.API_URL}/account/reset-password`, {
        method: 'PUT',
        body: JSON.stringify(request)
    });

export const useResetPassword = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: resetPassword,
        onSuccess: data => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user', data.id] });
        }
    });
};
