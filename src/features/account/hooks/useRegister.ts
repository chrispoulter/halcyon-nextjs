import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdatedResponse } from '@/features/common/commonTypes';
import { RegisterRequest } from '@/features/account/accountTypes';
import { fetcher } from '@/lib/fetch';
import { config } from '@/lib/config';

const register = (request: RegisterRequest) =>
    fetcher<UpdatedResponse>(`${config.API_URL}/account/register`, {
        method: 'POST',
        body: JSON.stringify(request)
    });

export const useRegister = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: register,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
    });
};
