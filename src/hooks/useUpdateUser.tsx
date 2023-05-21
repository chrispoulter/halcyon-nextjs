import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateUserRequest } from '@/models/user.types';
import { fetcher } from '@/utils/fetch';
import { UpdatedResponse } from '@/utils/handler';

export const updateUser = (id: string, request: UpdateUserRequest) =>
    fetcher<UpdatedResponse>(`/api/user/${id}`, 'PUT', request);

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
