import { useMutation } from '@tanstack/react-query';
import ky from 'ky';
import { ChangePasswordRequest } from '@/models/manage.types';
import { HandlerResponse, UpdatedResponse } from '@/utils/handler';

const changePassword = (json: ChangePasswordRequest) =>
    ky
        .put('api/manage/change-password', { json })
        .json<HandlerResponse<UpdatedResponse>>();

export const useChangePassword = () => {
    const { mutateAsync } = useMutation({
        mutationFn: changePassword
    });

    return { changePassword: mutateAsync };
};
