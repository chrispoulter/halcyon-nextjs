import { api } from '@/redux/api';
import { UpdatedResponse } from '@/features/common/commonTypes';
import {
    SearchUsersResponse,
    SearchUsersRequest,
    CreateUserRequest,
    GetUserResponse,
    UpdateUserRequest,
    LockUserRequest,
    UnlockUserRequest,
    DeleteUserRequest
} from './userTypes';

export const userEndpoints = api.injectEndpoints({
    endpoints: builder => ({
        searchUsers: builder.query<
            SearchUsersResponse,
            { params: SearchUsersRequest; accessToken?: string }
        >({
            query: ({ params, accessToken }) => ({
                url: `/user`,
                params,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }),
            providesTags: result => [
                { type: 'User', id: 'PARTIAL-LIST' },
                ...(result?.items?.map(user => ({
                    type: 'User' as const,
                    id: user.id
                })) || [])
            ]
        }),
        createUser: builder.mutation<
            UpdatedResponse,
            { body: CreateUserRequest; accessToken?: string }
        >({
            query: ({ body, accessToken }) => ({
                url: '/user',
                method: 'POST',
                body,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }),
            invalidatesTags: (_, error) =>
                error ? [] : [{ type: 'User', id: 'PARTIAL-LIST' }]
        }),
        getUser: builder.query<
            GetUserResponse,
            { id: string; accessToken?: string }
        >({
            query: ({ id, accessToken }) => ({
                url: `/user/${id}`,
                headers: { Authorization: `Bearer ${accessToken}` }
            }),
            providesTags: result => [{ type: 'User', id: result?.id }]
        }),
        updateUser: builder.mutation<
            UpdatedResponse,
            { id: string; body: UpdateUserRequest; accessToken?: string }
        >({
            query: ({ id, body, accessToken }) => ({
                url: `/user/${id}`,
                method: 'PUT',
                body,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }),
            invalidatesTags: (result, error) =>
                error ? [] : [{ type: 'User', id: result?.id }]
        }),
        lockUser: builder.mutation<
            UpdatedResponse,
            { id: string; body: LockUserRequest; accessToken?: string }
        >({
            query: ({ id, body, accessToken }) => ({
                url: `/user/${id}/lock`,
                method: 'PUT',
                body,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }),
            invalidatesTags: (result, error) =>
                error ? [] : [{ type: 'User', id: result?.id }]
        }),
        unlockUser: builder.mutation<
            UpdatedResponse,
            { id: string; body: UnlockUserRequest; accessToken?: string }
        >({
            query: ({ id, body, accessToken }) => ({
                url: `/user/${id}/unlock`,
                method: 'PUT',
                body,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }),
            invalidatesTags: (result, error) =>
                error ? [] : [{ type: 'User', id: result?.id }]
        }),
        deleteUser: builder.mutation<
            UpdatedResponse,
            { id: string; body: DeleteUserRequest; accessToken?: string }
        >({
            query: ({ id, body, accessToken }) => ({
                url: `/user/${id}`,
                method: 'DELETE',
                body,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }),
            invalidatesTags: (_, error) =>
                error ? [] : [{ type: 'User', id: 'PARTIAL-LIST' }]
        })
    }),
    overrideExisting: false
});

export const {
    useSearchUsersQuery,
    useCreateUserMutation,
    useGetUserQuery,
    useUpdateUserMutation,
    useLockUserMutation,
    useUnlockUserMutation,
    useDeleteUserMutation
} = userEndpoints;

export const { searchUsers, getUser } = userEndpoints.endpoints;
