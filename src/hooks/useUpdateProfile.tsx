import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateProfileRequest } from '@/models/manage.types';
import { fetcher } from '@/utils/fetch';
import { UpdatedResponse } from '@/utils/handler';

const updateProfile = (request: UpdateProfileRequest) =>
    fetcher<UpdatedResponse>('/api/manage', {
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
