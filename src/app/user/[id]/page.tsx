import { redirect, notFound, forbidden } from 'next/navigation';
import { getUser } from '@/app/user/data/get-user';
import { UpdateUser } from '@/app/user/[id]/update-user';
import { getSession } from '@/lib/session';
import { isUserAdministrator } from '@/lib/definitions';

export async function generateMetadata({ params }: PageProps<'/user/[id]'>) {
    const session = await getSession();

    if (!session) {
        redirect('/account/login');
    }

    if (!isUserAdministrator.some((value) => session.roles?.includes(value))) {
        forbidden();
    }

    const { id } = await params;
    const user = await getUser(id);

    if (!user) {
        notFound();
    }

    return {
        title: `${user.firstName} ${user.lastName}`,
    };
}

export default async function UpdateUserPage({
    params,
}: PageProps<'/user/[id]'>) {
    const session = await getSession();

    if (!session) {
        redirect('/account/login');
    }

    if (!isUserAdministrator.some((value) => session.roles?.includes(value))) {
        forbidden();
    }

    const { id } = await params;
    const user = await getUser(id);

    if (!user) {
        notFound();
    }

    return <UpdateUser user={user} />;
}
