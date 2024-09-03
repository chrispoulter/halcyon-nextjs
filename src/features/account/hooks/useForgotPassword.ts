import { useMutation } from '@tanstack/react-query';
import { ForgotPasswordRequest } from '@/features/account/accountTypes';
import { fetcher } from '@/lib/fetch';
import { config } from '@/lib/config';

export const forgotPassword = (request: ForgotPasswordRequest) =>
    fetcher(`${config.API_URL}/account/forgot-password`, {
        method: 'PUT',
        body: JSON.stringify(request)
    });

export const useForgotPassword = () =>
    useMutation({
        mutationFn: forgotPassword
    });
