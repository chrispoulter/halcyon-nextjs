import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { UpdatedResponse } from '@/features/common/common-types';
import { CreateUserRequest } from '@/features/user/user-types';
import { fetcher } from '@/lib/fetch';
import { config } from '@/lib/config';

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
