import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdatedResponse } from '@/features/common';
import { Role } from '@/utils/auth';
import { fetcher } from '@/utils/fetch';
import { config } from '@/utils/config';

export type UpdateUserRequest = {
    emailAddress: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    roles?: Role[];
    version?: number;
};

const updateUser = (id: string, request: UpdateUserRequest) =>
    fetcher<UpdatedResponse>(`${config.API_URL}/user/${id}`, {
        method: 'PUT',
        body: JSON.stringify(request)
    });

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
