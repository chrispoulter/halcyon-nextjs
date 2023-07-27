import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { HandlerResponse, UpdatedResponse } from '@/models/base.types';
import {
    ForgotPasswordRequest,
    RegisterRequest,
    ResetPasswordRequest
} from '@/models/account.types';
import {
    ChangePasswordRequest,
    DeleteAccountRequst,
    GetProfileResponse,
    UpdateProfileRequest
} from '@/models/manage.types';
import {
    CreateUserRequest,
    DeleteUserRequest,
    GetUserResponse,
    LockUserRequest,
    SearchUsersRequest,
    SearchUsersResponse,
    UnlockUserRequest,
    UpdateUserRequest
} from '@/models/user.types';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api'
    }),
    extractRehydrationInfo(action, { reducerPath }) {
        if (action.type === HYDRATE) {
            return action.payload[reducerPath];
        }
    },
    tagTypes: ['User'],
    endpoints: builder => ({
        register: builder.mutation<
            HandlerResponse<UpdatedResponse>,
            RegisterRequest
        >({
            query: body => ({
                url: '/account/register',
                method: 'POST',
                body
            }),
            invalidatesTags: [{ type: 'User', id: 'PARTIAL-LIST' }]
        }),
        forgotPassword: builder.mutation<
            HandlerResponse,
            ForgotPasswordRequest
        >({
            query: body => ({
                url: '/account/forgot-password',
                method: 'PUT',
                body
            })
        }),
        resetPassword: builder.mutation<
            HandlerResponse<UpdatedResponse>,
            ResetPasswordRequest
        >({
            query: body => ({
                url: '/account/reset-password',
                method: 'PUT',
                body
            })
        }),
        getProfile: builder.query<HandlerResponse<GetProfileResponse>, void>({
            query: () => '/manage',
            providesTags: result => [{ type: 'User', id: result?.data?.id }]
        }),
        updateProfile: builder.mutation<
            HandlerResponse<UpdatedResponse>,
            UpdateProfileRequest
        >({
            query: body => ({
                url: '/manage',
                method: 'PUT',
                body
            }),
            invalidatesTags: result => [{ type: 'User', id: result?.data?.id }]
        }),
        changePassword: builder.mutation<
            HandlerResponse<UpdatedResponse>,
            ChangePasswordRequest
        >({
            query: body => ({
                url: '/manage/change-password',
                method: 'PUT',
                body
            }),
            invalidatesTags: result => [{ type: 'User', id: result?.data?.id }]
        }),
        deleteAccount: builder.mutation<
            HandlerResponse<UpdatedResponse>,
            DeleteAccountRequst
        >({
            query: body => ({
                url: '/manage',
                method: 'DELETE',
                body
            }),
            invalidatesTags: [{ type: 'User', id: 'PARTIAL-LIST' }]
        }),
        searchUsers: builder.query<
            HandlerResponse<SearchUsersResponse>,
            SearchUsersRequest
        >({
            query: params => ({
                url: `/user`,
                params
            }),
            providesTags: result => [
                { type: 'User', id: 'PARTIAL-LIST' },
                ...(result?.data?.items?.map(user => ({
                    type: 'User' as const,
                    id: user.id
                })) || [])
            ]
        }),
        createUser: builder.mutation<
            HandlerResponse<UpdatedResponse>,
            CreateUserRequest
        >({
            query: body => ({
                url: '/user',
                method: 'POST',
                body
            }),
            invalidatesTags: [{ type: 'User', id: 'PARTIAL-LIST' }]
        }),
        getUser: builder.query<HandlerResponse<GetUserResponse>, string>({
            query: id => `/user/${id}`,
            providesTags: result => [{ type: 'User', id: result?.data?.id }]
        }),
        updateUser: builder.mutation<
            HandlerResponse<UpdatedResponse>,
            { id: string; body: UpdateUserRequest }
        >({
            query: ({ id, body }) => ({
                url: `/user/${id}`,
                method: 'PUT',
                body
            }),
            invalidatesTags: result => [{ type: 'User', id: result?.data?.id }]
        }),
        lockUser: builder.mutation<
            HandlerResponse<UpdatedResponse>,
            { id: string; body: LockUserRequest }
        >({
            query: ({ id, body }) => ({
                url: `/user/${id}/lock`,
                method: 'PUT',
                body
            }),
            invalidatesTags: result => [{ type: 'User', id: result?.data?.id }]
        }),
        unlockUser: builder.mutation<
            HandlerResponse<UpdatedResponse>,
            { id: string; body: UnlockUserRequest }
        >({
            query: ({ id, body }) => ({
                url: `/user/${id}/unlock`,
                method: 'PUT',
                body
            }),
            invalidatesTags: result => [{ type: 'User', id: result?.data?.id }]
        }),
        deleteUser: builder.mutation<
            HandlerResponse<UpdatedResponse>,
            { id: string; body: DeleteUserRequest }
        >({
            query: ({ id, body }) => ({
                url: `/user/${id}`,
                method: 'DELETE',
                body
            }),
            invalidatesTags: [{ type: 'User', id: 'PARTIAL-LIST' }]
        })
    })
});

export const {
    useRegisterMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useChangePasswordMutation,
    useDeleteAccountMutation,
    useSearchUsersQuery,
    useCreateUserMutation,
    useGetUserQuery,
    useUpdateUserMutation,
    useLockUserMutation,
    useUnlockUserMutation,
    useDeleteUserMutation
} = api;
