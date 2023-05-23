import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateUserRequest } from '@/models/user.types';
import { fetcher } from '@/utils/fetch';
import { HandlerResponse, UpdatedResponse } from '@/utils/handler';

export const createUser = (request: CreateUserRequest) =>
    fetcher<UpdatedResponse>('/api/user', {
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
