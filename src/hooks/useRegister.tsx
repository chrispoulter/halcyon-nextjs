import { useMutation } from '@tanstack/react-query';
import ky from 'ky';
import { RegisterRequest } from '@/models/account.types';
import { HandlerResponse, UpdatedResponse } from '@/utils/handler';

const register = (json: RegisterRequest) =>
    ky
        .post('api/account/register', { json })
        .json<HandlerResponse<UpdatedResponse>>();

export const useRegister = () => {
    const { mutateAsync } = useMutation({
        mutationFn: register
    });

    return { register: mutateAsync };
};
