import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { UpdatedResponse } from '@/features/common/commonTypes';
import { CreateUserRequest } from '@/features/user/userTypes';
import { fetcher } from '@/utils/fetch';
import { config } from '@/utils/config';

const createUser = (request: CreateUserRequest, init?: RequestInit) =>
    fetcher<UpdatedResponse>(`${config.API_URL}/user`, {
        ...init,
        method: 'POST',
        body: JSON.stringify(request)
    });

export const useCreateUser = () => {
    const { data: session } = useSession();

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: CreateUserRequest) =>
            createUser(request, {
                headers: { Authorization: `Bearer ${session?.accessToken}` }
            }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
    });
};
