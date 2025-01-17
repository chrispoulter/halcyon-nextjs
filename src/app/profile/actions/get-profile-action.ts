'use server';

import { notFound, redirect } from 'next/navigation';
import { GetProfileResponse } from '@/app/profile/profile-types';
import { apiClient, ApiClientError } from '@/lib/api-client';
import { getSession } from '@/lib/session';

export const getProfile = async () => {
    const session = await getSession();

    if (!session) {
        redirect('/account/login');
    }

    try {
        return await apiClient.get<GetProfileResponse>('/profile', undefined, {
            Authorization: `Bearer ${session.accessToken}`,
        });
    } catch (error) {
        if (error instanceof ApiClientError) {
            switch (error.status) {
                case 401:
                    redirect('/account/login');

                case 404:
                    notFound();
            }
        }

        throw error;
    }
};
