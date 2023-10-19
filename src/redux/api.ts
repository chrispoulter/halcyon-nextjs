import {
    BaseQueryApi,
    createApi,
    fetchBaseQuery
} from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { UpdatedResponse } from '@/models/base.types';
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
import { config } from '@/utils/config';

const isExtraWithCookies = (
    extra: unknown
): extra is {
    cookies: Partial<{
        [key: string]: string;
    }>;
} => typeof extra === 'object' && extra != null && 'cookies' in extra;

const prepareHeaders = (
    headers: Headers,
    {
        extra
    }: Pick<BaseQueryApi, 'getState' | 'extra' | 'endpoint' | 'type' | 'forced'>
) => {
    if (isExtraWithCookies(extra)) {
        const cookie = Object.entries(extra.cookies)
            .map(([key, value]) => `${key}=${value}`)
            .join('; ');

        headers.set('Cookie', cookie);
    }

    return headers;
};

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: config.API_URL,
        prepareHeaders
    }),
    extractRehydrationInfo(action, { reducerPath }) {
        if (action.type === HYDRATE) {
            return action.payload[reducerPath];
        }
    },
    tagTypes: ['User'],
    endpoints: builder => ({
        register: builder.mutation<UpdatedResponse, RegisterRequest>({
            query: body => ({
                url: '/account/register',
                method: 'POST',
                body
            }),
            invalidatesTags: (_, error) =>
                error ? [] : [{ type: 'User', id: 'PARTIAL-LIST' }]
        }),
        forgotPassword: builder.mutation<void, ForgotPasswordRequest>({
            query: body => ({
                url: '/account/forgot-password',
                method: 'PUT',
                body
            })
        }),
        resetPassword: builder.mutation<UpdatedResponse, ResetPasswordRequest>({
            query: body => ({
                url: '/account/reset-password',
                method: 'PUT',
                body
            })
        }),
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
        }),
        searchUsers: builder.query<SearchUsersResponse, SearchUsersRequest>({
            query: params => ({
                url: `/user`,
                params
            }),
            providesTags: result => [
                { type: 'User', id: 'PARTIAL-LIST' },
                ...(result?.items?.map(user => ({
                    type: 'User' as const,
                    id: user.id
                })) || [])
            ]
        }),
        createUser: builder.mutation<UpdatedResponse, CreateUserRequest>({
            query: body => ({
                url: '/user',
                method: 'POST',
                body
            }),
            invalidatesTags: (_, error) =>
                error ? [] : [{ type: 'User', id: 'PARTIAL-LIST' }]
        }),
        getUser: builder.query<GetUserResponse, string>({
            query: id => `/user/${id}`,
            providesTags: result => [{ type: 'User', id: result?.id }]
        }),
        updateUser: builder.mutation<
            UpdatedResponse,
            { id: string; body: UpdateUserRequest }
        >({
            query: ({ id, body }) => ({
                url: `/user/${id}`,
                method: 'PUT',
                body
            }),
            invalidatesTags: (result, error) =>
                error ? [] : [{ type: 'User', id: result?.id }]
        }),
        lockUser: builder.mutation<
            UpdatedResponse,
            { id: string; body: LockUserRequest }
        >({
            query: ({ id, body }) => ({
                url: `/user/${id}/lock`,
                method: 'PUT',
                body
            }),
            invalidatesTags: (result, error) =>
                error ? [] : [{ type: 'User', id: result?.id }]
        }),
        unlockUser: builder.mutation<
            UpdatedResponse,
            { id: string; body: UnlockUserRequest }
        >({
            query: ({ id, body }) => ({
                url: `/user/${id}/unlock`,
                method: 'PUT',
                body
            }),
            invalidatesTags: (result, error) =>
                error ? [] : [{ type: 'User', id: result?.id }]
        }),
        deleteUser: builder.mutation<
            UpdatedResponse,
            { id: string; body: DeleteUserRequest }
        >({
            query: ({ id, body }) => ({
                url: `/user/${id}`,
                method: 'DELETE',
                body
            }),
            invalidatesTags: (_, error) =>
                error ? [] : [{ type: 'User', id: 'PARTIAL-LIST' }]
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
    useDeleteUserMutation,
    util: { getRunningQueriesThunk }
} = api;

export const { getProfile, getUser, searchUsers } = api.endpoints;
