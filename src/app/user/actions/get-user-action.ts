'use server';

import { forbidden, notFound, redirect } from 'next/navigation';
import type { GetUserResponse } from '@/app/user/user-types';
import { apiClient, ApiClientError } from '@/lib/api-client';
import { getSession } from '@/lib/session';
import { Role } from '@/lib/session-types';

const roles = [Role.SYSTEM_ADMINISTRATOR, Role.USER_ADMINISTRATOR];

export const getUser = async (id: string) => {
    const session = await getSession();

    if (!session) {
        redirect('/account/login');
    }

    if (!roles.some((value) => session.roles?.includes(value))) {
        forbidden();
    }

    try {
        return await apiClient.get<GetUserResponse>(`/user/${id}`, undefined, {
            Authorization: `Bearer ${session.accessToken}`,
        });
    } catch (error) {
        if (error instanceof ApiClientError) {
            switch (error.status) {
                case 401:
                    redirect('/account/login');

                case 403:
                    forbidden();

                case 404:
                    notFound();
            }
        }

        throw error;
    }
};
