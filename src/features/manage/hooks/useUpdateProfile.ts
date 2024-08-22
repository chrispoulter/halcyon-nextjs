import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdatedResponse } from '@/features/common/commonTypes';
import { UpdateProfileRequest } from '@/features/manage/manageTypes';
import { fetcher } from '@/utils/fetch';
import { config } from '@/utils/config';

const updateProfile = (request: UpdateProfileRequest) =>
    fetcher<UpdatedResponse>(`${config.API_URL}/manage`, {
        method: 'PUT',
        body: JSON.stringify(request)
    });

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    const { mutateAsync } = useMutation({
        mutationFn: updateProfile,
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['profile'] })
    });

    return { updateProfile: mutateAsync };
};
