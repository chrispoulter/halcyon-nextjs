import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config } from '../utils/config';

export const halcyonApi = createApi({
    reducerPath: 'halcyonApi',
    baseQuery: fetchBaseQuery({
        baseUrl: config.API_URL,
        prepareHeaders: (headers, { getState }) => {
            const { accessToken } = getState().auth;

            if (accessToken) {
                headers.set('authorization', `Bearer ${accessToken}`);
            }

            return headers;
        }
    }),
    endpoints: builder => ({
        register: builder.mutation({
            query: body => ({
                url: '/account/register',
                method: 'POST',
                body
            })
        }),
        forgotPassword: builder.mutation({
            query: body => ({
                url: '/account/forgotpassword',
                method: 'PUT',
                body
            })
        }),
        resetPassword: builder.mutation({
            query: body => ({
                url: '/account/resetpassword',
                method: 'PUT',
                body
            })
        }),
        createToken: builder.mutation({
            query: body => ({
                url: '/token',
                method: 'POST',
                body
            })
        }),
        getProfile: builder.query({
            query: () => '/manage'
        }),
        updateProfile: builder.mutation({
            query: body => ({
                url: '/manage',
                method: 'PUT',
                body
            })
        }),
        changePassword: builder.mutation({
            query: body => ({
                url: '/manage/changepassword',
                method: 'PUT',
                body
            })
        }),
        deleteAccount: builder.mutation({
            query: {
                url: '/manage',
                method: 'DELETE'
            }
        }),
        searchUsers: builder.query({
            query: params => ({
                url: `/user`,
                params
            })
        }),
        createUser: builder.mutation({
            query: body => ({
                url: '/user',
                method: 'POST',
                body
            })
        }),
        getUser: builder.query({
            query: id => `/user/${id}`
        }),
        updateUser: builder.mutation({
            query: ({ id, body }) => ({
                url: `/user/${id}`,
                method: 'PUT',
                body
            })
        }),
        lockUser: builder.mutation({
            query: id => ({
                url: `/user/${id}/lock`,
                method: 'PUT'
            })
        }),
        unlockUser: builder.mutation({
            query: id => ({
                url: `/user/${id}/unlock`,
                method: 'PUT'
            })
        }),
        deleteUser: builder.mutation({
            query: id => ({
                url: `/user/${id}`,
                method: 'DELETE'
            })
        })
    })
});

export const {
    useRegisterMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useCreateTokenMutation,
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
} = halcyonApi;
