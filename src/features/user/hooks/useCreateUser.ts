import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdatedResponse } from '@/features/common';
import { Role } from '@/utils/auth';
import { fetcher } from '@/utils/fetch';
import { config } from '@/utils/config';

export type CreateUserRequest = {
    emailAddress: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    roles?: Role[];
};

const createUser = (request: CreateUserRequest) =>
    fetcher<UpdatedResponse>(`${config.API_URL}/user`, {
        method: 'POST',
        body: JSON.stringify(request)
    });

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    const { mutateAsync } = useMutation({
        mutationFn: createUser,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
    });

    return { createUser: mutateAsync };
};
