import { useMutation } from '@tanstack/react-query';
import { ResetPasswordRequest } from '@/models/account.types';
import { fetcher } from '@/utils/fetch';
import { UpdatedResponse } from '@/utils/handler';

export const resetPassword = (request: ResetPasswordRequest) =>
    fetcher<UpdatedResponse>('/api/account/reset-password', 'PUT', request);

export const useResetPassword = () => {
    const { mutateAsync } = useMutation({
        mutationFn: resetPassword
    });

    return { resetPassword: mutateAsync };
};
