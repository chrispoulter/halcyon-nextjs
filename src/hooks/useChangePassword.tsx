import { useMutation } from '@tanstack/react-query';
import { ChangePasswordRequest } from '@/models/manage.types';
import { fetcher } from '@/utils/fetch';
import { UpdatedResponse } from '@/utils/handler';

const changePassword = (request: ChangePasswordRequest) =>
    fetcher<UpdatedResponse>('/api/manage/change-password', {
        method: 'PUT',
        body: JSON.stringify(request)
    });

export const useChangePassword = () => {
    const { mutateAsync } = useMutation({
        mutationFn: changePassword
    });

    return { changePassword: mutateAsync };
};
