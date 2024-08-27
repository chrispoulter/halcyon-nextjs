import { api } from '@/redux/api';
import { UpdatedResponse } from '@/features/common/commonTypes';
import {
    GetProfileResponse,
    UpdateProfileRequest,
    ChangePasswordRequest,
    DeleteAccountRequst
} from './manageTypes';

export const manageEndpoints = api.injectEndpoints({
    endpoints: builder => ({
        getProfile: builder.query<GetProfileResponse, void>({
            query: () => '/manage',
            providesTags: result => [{ type: 'User', id: result?.id }]
        }),
        updateProfile: builder.mutation<UpdatedResponse, UpdateProfileRequest>({
            query: body => ({
                url: '/manage',
                method: 'PUT',
                body
            }),
            invalidatesTags: (result, error) =>
                error ? [] : [{ type: 'User', id: result?.id }]
        }),
        changePassword: builder.mutation<
            UpdatedResponse,
            ChangePasswordRequest
        >({
            query: body => ({
                url: '/manage/change-password',
                method: 'PUT',
                body
            }),
            invalidatesTags: (result, error) =>
                error ? [] : [{ type: 'User', id: result?.id }]
        }),
        deleteAccount: builder.mutation<UpdatedResponse, DeleteAccountRequst>({
            query: body => ({
                url: '/manage',
                method: 'DELETE',
                body
            }),
            invalidatesTags: (_, error) =>
                error ? [] : [{ type: 'User', id: 'PARTIAL-LIST' }]
        })
    }),
    overrideExisting: false
});

export const {
    useGetProfileQuery,
    useUpdateProfileMutation,
    useChangePasswordMutation,
    useDeleteAccountMutation
} = manageEndpoints;

export const { getProfile } = manageEndpoints.endpoints;
