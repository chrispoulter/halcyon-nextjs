import useSWRMutation from 'swr/mutation';
import { ForgotPasswordRequest } from '@/models/account.types';
import { fetcher } from '@/utils/fetch';

const forgotPassword = async (
    url: string,
    { arg }: { arg: ForgotPasswordRequest }
) =>
    fetcher(url, {
        method: 'PUT',
        body: JSON.stringify(arg)
    });

export const useForgotPassword = () => {
    const { trigger } = useSWRMutation(
        '/api/account/forgot-password',
        forgotPassword
    );

    return { forgotPassword: trigger };
};
