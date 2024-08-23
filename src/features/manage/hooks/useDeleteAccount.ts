import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdatedResponse } from '@/features/common/commonTypes';
import { DeleteAccountRequst } from '@/features/manage/manageTypes';
import { fetchWithToken } from '@/utils/fetch';
import { config } from '@/utils/config';

const deleteAccount = (request: DeleteAccountRequst) =>
    fetchWithToken<UpdatedResponse>(`${config.API_URL}/manage`, {
        method: 'DELETE',
        body: JSON.stringify(request)
    });

export const useDeleteAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: DeleteAccountRequst) => deleteAccount(request),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ['profile'],
                refetchType: 'none'
            })
    });
};
