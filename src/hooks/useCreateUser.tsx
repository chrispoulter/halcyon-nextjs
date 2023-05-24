import { useMutation, useQueryClient } from '@tanstack/react-query';
import ky from 'ky';
import { CreateUserRequest } from '@/models/user.types';
import { HandlerResponse, UpdatedResponse } from '@/utils/handler';

const createUser = (json: CreateUserRequest) =>
    ky.post('api/user', { json }).json<HandlerResponse<UpdatedResponse>>();

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    const { mutateAsync } = useMutation({
        mutationFn: createUser,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
    });

    return { createUser: mutateAsync };
};
