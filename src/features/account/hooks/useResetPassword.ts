import { useMutation } from '@tanstack/react-query';
import { UpdatedResponse } from '@/features/common';
import { fetcher } from '@/utils/fetch';
import { config } from '@/utils/config';

export type ResetPasswordRequest = {
    token: string;
    emailAddress: string;
    newPassword: string;
};

const resetPassword = (request: ResetPasswordRequest) =>
    fetcher<UpdatedResponse>(`${config.API_URL}/account/reset-password`, {
        method: 'PUT',
        body: JSON.stringify(request)
    });

export const useResetPassword = () => {
    const { mutateAsync } = useMutation({
        mutationFn: resetPassword
    });

    return { resetPassword: mutateAsync };
};
