'use server';

import { forbidden, redirect } from 'next/navigation';
import { type SearchUsersResponse } from '@/app/user/user-types';
import { apiClient, ApiClientError } from '@/lib/api-client';
import { deleteSession, getSession } from '@/lib/session';
import { Role } from '@/lib/session-types';

const roles = [Role.SYSTEM_ADMINISTRATOR, Role.USER_ADMINISTRATOR];

export const searchUsers = async (request: {
    page?: number;
    size?: number;
    sort: string;
    search: string;
}) => {
    const session = await getSession();

    if (!session) {
        await deleteSession();
        redirect('/account/login');
    }

    if (!roles.some((value) => session.roles?.includes(value))) {
        forbidden();
    }

    try {
        return await apiClient.get<SearchUsersResponse>('/user', request, {
            Authorization: `Bearer ${session.accessToken}`,
        });
    } catch (error) {
        if (error instanceof ApiClientError) {
            switch (error.status) {
                case 401:
                    await deleteSession();
                    redirect('/account/login');

                case 403:
                    forbidden();
            }
        }

        throw error;
    }
};
