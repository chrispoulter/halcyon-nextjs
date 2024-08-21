import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdatedResponse } from '@/features/common';
import { fetcher } from '@/utils/fetch';
import { config } from '@/utils/config';

export type UpdateProfileRequest = {
    emailAddress: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    version?: number;
};

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
