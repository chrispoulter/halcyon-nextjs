import { useMutation } from '@tanstack/react-query';
import ky from 'ky-universal';
import { ResetPasswordRequest } from '@/models/account.types';
import { HandlerResponse, UpdatedResponse } from '@/utils/handler';

const resetPassword = (json: ResetPasswordRequest) =>
    ky
        .put('account/reset-password', { prefixUrl: '/api', json })
        .json<HandlerResponse<UpdatedResponse>>();

export const useResetPassword = () => {
    const { mutateAsync } = useMutation({
        mutationFn: resetPassword
    });

    return { resetPassword: mutateAsync };
};
