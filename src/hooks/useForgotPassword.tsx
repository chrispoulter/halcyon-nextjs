import { useMutation } from '@tanstack/react-query';
import ky from 'ky';
import { ForgotPasswordRequest } from '@/models/account.types';
import { HandlerResponse } from '@/utils/handler';

export const forgotPassword = (json: ForgotPasswordRequest) =>
    ky.put('api/account/forgot-password', { json }).json<HandlerResponse>();

export const useForgotPassword = () => {
    const { mutateAsync } = useMutation({
        mutationFn: forgotPassword
    });

    return { forgotPassword: mutateAsync };
};
