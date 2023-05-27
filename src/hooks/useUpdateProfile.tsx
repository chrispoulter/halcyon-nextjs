import { useMutation, useQueryClient } from '@tanstack/react-query';
import ky from 'ky-universal';
import { UpdateProfileRequest } from '@/models/manage.types';
import { HandlerResponse, UpdatedResponse } from '@/utils/handler';

const updateProfile = (json: UpdateProfileRequest) =>
    ky
        .put('manage', { prefixUrl: '/api', json })
        .json<HandlerResponse<UpdatedResponse>>();

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    const { mutateAsync } = useMutation({
        mutationFn: updateProfile,
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['profile'] })
    });

    return { updateProfile: mutateAsync };
};
