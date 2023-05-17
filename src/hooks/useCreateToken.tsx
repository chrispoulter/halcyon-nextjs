import useSWRMutation from 'swr/mutation';
import { CreateTokenRequest } from '@/models/token.types';
import { fetcher } from '@/utils/fetch';

const createToken = async (url: string, { arg }: { arg: CreateTokenRequest }) =>
    fetcher(url, 'POST', arg);

export const useCreateToken = () => {
    const { trigger } = useSWRMutation('/api/token', createToken);

    return { createToken: trigger };
};
