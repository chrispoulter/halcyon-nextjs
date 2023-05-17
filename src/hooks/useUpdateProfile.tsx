import useSWRMutation from 'swr/mutation';
import { UpdateProfileRequest } from '@/models/manage.types';
import { fetcher } from '@/utils/fetch';

const updateProfile = async (
    url: string,
    { arg }: { arg: UpdateProfileRequest }
) => fetcher(url, 'PUT', arg);

export const useUpdateProfile = () => {
    const { trigger } = useSWRMutation('/api/manage', updateProfile);

    return { updateProfile: trigger };
};
