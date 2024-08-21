import { useMutation } from '@tanstack/react-query';
import { UpdatedResponse } from '@/features/common';
import { fetcher } from '@/utils/fetch';
import { config } from '@/utils/config';

export type ChangePasswordRequest = {
    currentPassword: string;
    newPassword: string;
    version?: number;
};

const changePassword = (request: ChangePasswordRequest) =>
    fetcher<UpdatedResponse>(`${config.API_URL}/manage/change-password`, {
        method: 'PUT',
        body: JSON.stringify(request)
    });

export const useChangePassword = () => {
    const { mutateAsync } = useMutation({
        mutationFn: changePassword
    });

    return { changePassword: mutateAsync };
};
