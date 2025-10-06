import { getUser } from '@/app/user/data/get-user';
import { UpdateUser } from '@/app/user/[id]/update-user';

export async function generateMetadata({ params }: PageProps<'/user/[id]'>) {
    const { id } = await params;
    const user = await getUser(id);

    return {
        title: `${user.firstName} ${user.lastName}`,
    };
}

export default async function UpdateUserPage({
    params,
}: PageProps<'/user/[id]'>) {
    const { id } = await params;
    const user = await getUser(id);
    return <UpdateUser user={user} />;
}
