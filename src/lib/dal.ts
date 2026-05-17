import 'server-only';

import { cache } from 'react';
import { forbidden, redirect } from 'next/navigation';
import { getSession } from './session';
import { Role } from './types';

export const verifySession = cache(async (roles?: Role[]) => {
    const session = await getSession();

    if (!session) {
        redirect('/account/login');
    }

    if (roles && !roles.some((value) => session.roles?.includes(value))) {
        forbidden();
    }

    return session;
});
