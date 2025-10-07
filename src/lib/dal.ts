import 'server-only';

import { forbidden, redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { Role } from '@/lib/definitions';

export async function verifySession(roles?: Role[]) {
    const session = await getSession();

    if (!session) {
        redirect('/account/login');
    }

    if (roles && !roles.some((value) => session.roles?.includes(value))) {
        forbidden();
    }

    return session;
}
