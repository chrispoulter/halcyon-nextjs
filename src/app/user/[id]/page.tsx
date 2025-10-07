import { forbidden, notFound, redirect } from 'next/navigation';
import { getUser } from '@/app/user/data/get-user';
import { UpdateUser } from '@/app/user/[id]/update-user';
import { isUserAdministrator } from '@/lib/definitions';
import { getSession } from '@/lib/session';

async function loadUser({ params }: PageProps<'/user/[id]'>) {
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

    return user;
}

export async function generateMetadata(props: PageProps<'/user/[id]'>) {
    const user = await loadUser(props);

    return {
        title: `${user.firstName} ${user.lastName}`,
    };
}

export default async function UpdateUserPage(props: PageProps<'/user/[id]'>) {
    const user = await loadUser(props);
    return <UpdateUser user={user} />;
}
