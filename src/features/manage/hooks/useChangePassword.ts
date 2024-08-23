import { useMutation } from '@tanstack/react-query';
import { UpdatedResponse } from '@/features/common/commonTypes';
import { ChangePasswordRequest } from '@/features/manage/manageTypes';
import { fetchWithToken } from '@/utils/fetch';
import { config } from '@/utils/config';

const changePassword = (request: ChangePasswordRequest) =>
    fetchWithToken<UpdatedResponse>(
        `${config.API_URL}/manage/change-password`,
        {
            method: 'PUT',
            body: JSON.stringify(request)
        }
    );

export const useChangePassword = () => {
    const { mutate, isPending } = useMutation({
        mutationFn: changePassword
    });

    return { changePassword: mutate, isSaving: isPending };
};
