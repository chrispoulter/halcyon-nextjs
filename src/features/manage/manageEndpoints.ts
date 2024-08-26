import { api } from '@/redux/api';
import {
    AuthorizedRequest,
    UpdatedResponse
} from '@/features/common/commonTypes';
import {
    GetProfileResponse,
    UpdateProfileRequest,
    ChangePasswordRequest,
    DeleteAccountRequst
} from './manageTypes';

export const manageEndpoints = api.injectEndpoints({
    endpoints: builder => ({
        getProfile: builder.query<GetProfileResponse, AuthorizedRequest>({
            query: ({ accessToken }) => ({
                url: '/manage',
                headers: { Authorization: `Bearer ${accessToken}` }
            }),
            providesTags: result => [{ type: 'User', id: result?.id }]
        }),
        updateProfile: builder.mutation<
            UpdatedResponse,
            { body: UpdateProfileRequest } & AuthorizedRequest
        >({
            query: ({ body, accessToken }) => ({
                url: '/manage',
                method: 'PUT',
                body,
                headers: { Authorization: `Bearer ${accessToken}` }
            }),
            invalidatesTags: (result, error) =>
                error ? [] : [{ type: 'User', id: result?.id }]
        }),
        changePassword: builder.mutation<
            UpdatedResponse,
            { body: ChangePasswordRequest } & AuthorizedRequest
        >({
            query: ({ body, accessToken }) => ({
                url: '/manage/change-password',
                method: 'PUT',
                body,
                headers: { Authorization: `Bearer ${accessToken}` }
            }),
            invalidatesTags: (result, error) =>
                error ? [] : [{ type: 'User', id: result?.id }]
        }),
        deleteAccount: builder.mutation<
            UpdatedResponse,
            { body: DeleteAccountRequst } & AuthorizedRequest
        >({
            query: ({ body, accessToken }) => ({
                url: '/manage',
                method: 'DELETE',
                body,
                headers: { Authorization: `Bearer ${accessToken}` }
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
