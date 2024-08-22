import { useMutation } from '@tanstack/react-query';
import { UpdatedResponse } from '@/features/common/commonTypes';
import { ResetPasswordRequest } from '@/features/account/accountTypes';
import { fetchWithToken } from '@/utils/fetch';
import { config } from '@/utils/config';

const resetPassword = (request: ResetPasswordRequest) =>
    fetchWithToken<UpdatedResponse>(
        `${config.API_URL}/account/reset-password`,
        {
            method: 'PUT',
            body: JSON.stringify(request)
        }
    );

export const useResetPassword = () => {
    const { mutateAsync } = useMutation({
        mutationFn: resetPassword
    });

    return { resetPassword: mutateAsync };
};
