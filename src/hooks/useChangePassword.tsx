import useSWRMutation from 'swr/mutation';
import { ChangePasswordRequest } from '@/models/manage.types';
import { fetcher } from '@/utils/fetch';

const changePassword = async (
    url: string,
    { arg }: { arg: ChangePasswordRequest }
) => fetcher(url, 'PUT', arg);

export const useChangePassword = () => {
    const { trigger } = useSWRMutation(
        '/api/manage/change-password',
        changePassword
    );

    return { changePassword: trigger };
};
