import { api } from '@/redux/api';
import { UpdatedResponse } from '../apiTypes';
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

export const userApi = api
    .enhanceEndpoints({ addTagTypes: ['User'] })
    .injectEndpoints({
        endpoints: builder => ({
            searchUsers: builder.query<SearchUsersResponse, SearchUsersRequest>(
                {
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
                }
            ),
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
} = userApi;

export const { searchUsers, getUser } = userApi.endpoints;
