import { useMutation } from '@tanstack/react-query';
import { RegisterRequest } from '@/models/account.types';
import { fetcher } from '@/utils/fetch';
import { UpdatedResponse } from '@/utils/handler';

export const register = (request: RegisterRequest) =>
    fetcher<UpdatedResponse>('/api/account/register', {
        method: 'POST',
        body: JSON.stringify(request)
    });

export const useRegister = () => {
    const { mutateAsync } = useMutation({
        mutationFn: register
    });

    return { register: mutateAsync };
};
