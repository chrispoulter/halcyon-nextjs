'use server';

import { redirect } from 'next/navigation';
import { deleteSession } from '@/lib/session';

export const logoutAction = async () => {
    await deleteSession();
    redirect('/account/login');
};
