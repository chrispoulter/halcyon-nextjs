import { useMutation } from '@tanstack/react-query';
import { ForgotPasswordRequest } from '@/features/account/accountTypes';
import { fetchWithToken } from '@/utils/fetch';
import { config } from '@/utils/config';

export const forgotPassword = (request: ForgotPasswordRequest) =>
    fetchWithToken(`${config.API_URL}/account/forgot-password`, {
        method: 'PUT',
        body: JSON.stringify(request)
    });

export const useForgotPassword = () => {
    const { mutate, isPending } = useMutation({
        mutationFn: forgotPassword
    });

    return { forgotPassword: mutate, isSaving: isPending };
};
