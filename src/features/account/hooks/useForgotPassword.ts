import { useMutation } from '@tanstack/react-query';
import { fetcher } from '@/utils/fetch';
import { config } from '@/utils/config';

export type ForgotPasswordRequest = { emailAddress: string; siteUrl: string };

export const forgotPassword = (request: ForgotPasswordRequest) =>
    fetcher(`${config.API_URL}account/forgot-password`, {
        method: 'PUT',
        body: JSON.stringify(request)
    });

export const useForgotPassword = () => {
    const { mutateAsync } = useMutation({
        mutationFn: forgotPassword
    });

    return { forgotPassword: mutateAsync };
};
