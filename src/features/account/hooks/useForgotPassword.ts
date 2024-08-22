import { useMutation } from '@tanstack/react-query';
import { ForgotPasswordRequest } from '@/features/account/accountTypes';
import { fetcher } from '@/utils/fetch';
import { config } from '@/utils/config';

export const forgotPassword = (request: ForgotPasswordRequest) =>
    fetcher(`${config.API_URL}/account/forgot-password`, {
        method: 'PUT',
        body: JSON.stringify(request)
    });

export const useForgotPassword = () => {
    const { mutateAsync } = useMutation({
        mutationFn: forgotPassword
    });

    return { forgotPassword: mutateAsync };
};
