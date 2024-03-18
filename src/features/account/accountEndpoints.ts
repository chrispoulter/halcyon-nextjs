import { api } from '@/redux/api';
import { UpdatedResponse } from '@/features/commonTypes';
import {
    RegisterRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest
} from './accountTypes';

export const accountEndpoints = api
    .enhanceEndpoints({ addTagTypes: ['User'] })
    .injectEndpoints({
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
            resetPassword: builder.mutation<
                UpdatedResponse,
                ResetPasswordRequest
            >({
                query: body => ({
                    url: '/account/reset-password',
                    method: 'PUT',
                    body
                })
            })
        }),
        overrideExisting: false
    });

export const {
    useRegisterMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation
} = accountEndpoints;
