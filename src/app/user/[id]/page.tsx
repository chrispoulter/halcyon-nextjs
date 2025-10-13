import { notFound } from 'next/navigation';
import { getUser } from '@/app/user/data/get-user';
import { UpdateUser } from '@/app/user/[id]/update-user';
import { verifySession } from '@/lib/dal';
import { isUserAdministrator } from '@/lib/definitions';

async function loadUser({ params }: PageProps<'/user/[id]'>) {
    await verifySession(isUserAdministrator);

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
