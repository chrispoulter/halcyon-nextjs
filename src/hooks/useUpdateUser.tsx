import useSWRMutation from 'swr/mutation';
import { UpdateUserRequest } from '@/models/user.types';
import { fetcher } from '@/utils/fetch';

const updateUser = async (url: string, { arg }: { arg: UpdateUserRequest }) =>
    fetcher(url, 'PUT', arg);

export const useUpdateUser = (id: string) => {
    const { trigger } = useSWRMutation(`/api/user/${id}`, updateUser);

    return { updateUser: trigger };
};
