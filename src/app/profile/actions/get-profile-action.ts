'use server';

import type { GetProfileResponse } from '@/app/profile/profile-types';
import { authActionClient } from '@/lib/safe-action';

export const getProfileAction = authActionClient()
    .metadata({ actionName: 'getProfileAction' })
    .action(async ({ ctx: { userId } }) => {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        console.log('request', userId);

        return {
            id: 'fake-id',
            emailAddress: 'fake.name@example.com',
            firstName: 'Fake',
            lastName: 'Name',
            dateOfBirth: '1970-01-01',
            version: 1234,
        } as GetProfileResponse;
    });
