import { getUserAction } from '@/app/user/actions/get-user-action';
import { UpdateUser } from '@/app/user/[id]/update-user';
import {
    isServerActionSuccess,
    ServerActionError,
} from '@/components/server-action-error';

export async function generateMetadata({ params }: PageProps<'/user/[id]'>) {
    const { id } = await params;

    const result = await getUserAction({ id });

    if (!isServerActionSuccess(result)) {
        return { title: 'Update User' };
    }

    return {
        title: `${result.data.firstName} ${result.data.lastName}`,
    };
}

export default async function UpdateUserPage({
    params,
}: PageProps<'/user/[id]'>) {
    const { id } = await params;

    const result = await getUserAction({ id });

    if (!isServerActionSuccess(result)) {
        return <ServerActionError result={result} />;
    }

    return <UpdateUser user={result.data} />;
}
