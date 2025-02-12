import { getUserAction } from '@/app/user/actions/get-user-action';
import { UpdateUser } from '@/app/user/[id]/update-user';
import {
    isServerActionSuccess,
    ServerActionError,
} from '@/components/server-action-error';

type UpdateUserPageProps = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: UpdateUserPageProps) {
    const { id } = await params;

    const result = await getUserAction({ id });

    if (!isServerActionSuccess(result)) {
        return { title: 'Update User' };
    }

    return {
        title: `${result.data.firstName} ${result.data.lastName}`,
    };
}

export default async function UpdateUserPage({ params }: UpdateUserPageProps) {
    const { id } = await params;

    const result = await getUserAction({ id });

    if (!isServerActionSuccess(result)) {
        return <ServerActionError result={result} />;
    }

    return <UpdateUser user={result.data} />;
}
