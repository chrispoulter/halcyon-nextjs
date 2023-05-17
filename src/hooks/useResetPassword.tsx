import useSWRMutation from 'swr/mutation';
import { ResetPasswordRequest } from '@/models/account.types';
import { fetcher } from '@/utils/fetch';

const resetPassword = async (
    url: string,
    { arg }: { arg: ResetPasswordRequest }
) => fetcher(url, 'PUT', arg);

export const useResetPassword = () => {
    const { trigger } = useSWRMutation(
        '/api/account/reset-password',
        resetPassword
    );

    return { resetPassword: trigger };
};
