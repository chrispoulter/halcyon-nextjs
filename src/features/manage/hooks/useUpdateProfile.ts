import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdatedResponse } from '@/features/common/commonTypes';
import { UpdateProfileRequest } from '@/features/manage/manageTypes';
import { fetchWithToken } from '@/utils/fetch';
import { config } from '@/utils/config';

const updateProfile = (request: UpdateProfileRequest) =>
    fetchWithToken<UpdatedResponse>(`${config.API_URL}/manage`, {
        method: 'PUT',
        body: JSON.stringify(request)
    });

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProfile,
        onSuccess: data => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            queryClient.invalidateQueries({ queryKey: ['user', data.id] });
        }
    });
};
