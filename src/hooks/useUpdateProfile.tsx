import { useMutation, useQueryClient } from '@tanstack/react-query';
import ky from 'ky';
import { UpdateProfileRequest } from '@/models/manage.types';
import { HandlerResponse, UpdatedResponse } from '@/utils/handler';

const updateProfile = (json: UpdateProfileRequest) =>
    ky.put('/api/manage', { json }).json<HandlerResponse<UpdatedResponse>>();

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    const { mutateAsync } = useMutation({
        mutationFn: updateProfile,
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['profile'] })
    });

    return { updateProfile: mutateAsync };
};
