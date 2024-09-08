import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { UpdatedResponse } from '@/features/common/commonTypes';
import { DeleteAccountRequst } from '@/features/manage/manageTypes';
import { fetcher as fetcher } from '@/lib/fetch';
import { config } from '@/lib/config';

const deleteAccount = (request: DeleteAccountRequst, init?: RequestInit) =>
    fetcher<UpdatedResponse>(`${config.API_URL}/manage`, {
        ...init,
        method: 'DELETE',
        body: JSON.stringify(request)
    });

export const useDeleteAccount = () => {
    const { data: session } = useSession();

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: DeleteAccountRequst) =>
            deleteAccount(request, {
                headers: { Authorization: `Bearer ${session?.accessToken}` }
            }),
        onSuccess: data => {
            queryClient.invalidateQueries({
                queryKey: ['profile'],
                refetchType: 'none'
            });

            queryClient.invalidateQueries({
                queryKey: ['user', data.id],
                refetchType: 'none'
            });
        }
    });
};
