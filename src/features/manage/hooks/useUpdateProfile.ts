import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { UpdatedResponse } from '@/features/common/commonTypes';
import { UpdateProfileRequest } from '@/features/manage/manageTypes';
import { fetcher } from '@/lib/fetch';
import { config } from '@/lib/config';

const updateProfile = (request: UpdateProfileRequest, init?: RequestInit) =>
    fetcher<UpdatedResponse>(`${config.API_URL}/manage`, {
        ...init,
        method: 'PUT',
        body: JSON.stringify(request)
    });

export const useUpdateProfile = () => {
    const { data: session } = useSession();

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: UpdateProfileRequest) =>
            updateProfile(request, {
                headers: { Authorization: `Bearer ${session?.accessToken}` }
            }),
        onSuccess: data => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user', data.id] });
        }
    });
};
