import { useMutation, useQueryClient } from '@tanstack/react-query';
import ky from 'ky-universal';
import { UpdateUserRequest } from '@/models/user.types';
import { HandlerResponse, UpdatedResponse } from '@/utils/handler';

const updateUser = (id: string, json: UpdateUserRequest) =>
    ky
        .put(`user/${id}`, { prefixUrl: '/api', json })
        .json<HandlerResponse<UpdatedResponse>>();

export const useUpdateUser = (id: string) => {
    const queryClient = useQueryClient();

    const { mutateAsync } = useMutation({
        mutationFn: (request: UpdateUserRequest) => updateUser(id, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user', id] });
        }
    });

    return { updateUser: mutateAsync };
};
