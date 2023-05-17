import useSWRMutation from 'swr/mutation';
import { RegisterRequest } from '@/models/account.types';
import { fetcher } from '@/utils/fetch';

const register = async (url: string, { arg }: { arg: RegisterRequest }) =>
    fetcher(url, 'POST', arg);

export const useRegister = () => {
    const { trigger } = useSWRMutation('/api/account/register', register);

    return { register: trigger };
};
