import { useMutation } from '@tanstack/react-query';
import { UpdatedResponse } from '@/features/common/commonTypes';
import { ChangePasswordRequest } from '../manageTypes';
import { fetcher } from '@/utils/fetch';
import { config } from '@/utils/config';

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
