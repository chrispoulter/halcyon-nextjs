import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdatedResponse } from '@/features/common/commonTypes';
import { CreateUserRequest } from '@/features/user/userTypes';
import { fetchWithToken } from '@/utils/fetch';
import { config } from '@/utils/config';

const createUser = (request: CreateUserRequest) =>
    fetchWithToken<UpdatedResponse>(`${config.API_URL}/user`, {
        method: 'POST',
        body: JSON.stringify(request)
    });

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createUser,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
    });
};
