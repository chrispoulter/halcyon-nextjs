import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdatedResponse } from '@/features/common/commonTypes';
import { UnlockUserRequest } from '../userTypes';
import { fetcher } from '@/utils/fetch';
import { config } from '@/utils/config';

const unlockUser = (id: string, request: UnlockUserRequest) =>
    fetcher<UpdatedResponse>(`${config.API_URL}/user/${id}/unlock`, {
        method: 'PUT',
        body: JSON.stringify(request)
    });

export const useUnlockUser = (id: string) => {
    const queryClient = useQueryClient();

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (request: UnlockUserRequest) => unlockUser(id, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user', id] });
        }
    });

    return { unlockUser: mutateAsync, isUnlocking: isPending };
};
