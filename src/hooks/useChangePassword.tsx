import { useMutation } from '@tanstack/react-query';
import ky from 'ky-universal';
import { ChangePasswordRequest } from '@/models/manage.types';
import { HandlerResponse, UpdatedResponse } from '@/utils/handler';

const changePassword = (json: ChangePasswordRequest) =>
    ky
        .put('manage/change-password', { prefixUrl: '/api', json })
        .json<HandlerResponse<UpdatedResponse>>();

export const useChangePassword = () => {
    const { mutateAsync } = useMutation({
        mutationFn: changePassword
    });

    return { changePassword: mutateAsync };
};
