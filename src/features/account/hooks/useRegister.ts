import { useMutation } from '@tanstack/react-query';
import { UpdatedResponse } from '@/features/common';
import { fetcher } from '@/utils/fetch';
import { config } from '@/utils/config';

export type RegisterRequest = {
    emailAddress: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
};

const register = (request: RegisterRequest) =>
    fetcher<UpdatedResponse>(`${config.API_URL}/account/register`, {
        method: 'POST',
        body: JSON.stringify(request)
    });

export const useRegister = () => {
    const { mutateAsync } = useMutation({
        mutationFn: register
    });

    return { register: mutateAsync };
};
