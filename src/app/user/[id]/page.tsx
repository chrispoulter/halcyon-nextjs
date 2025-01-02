import { Metadata } from 'next';
import { getUserAction } from '@/app/user/actions/get-user-action';
import { UpdateUserForm } from '@/app/user/[id]/update-user-form';
import { ServerActionError } from '@/components/server-action-error';
import { isServerActionSuccess } from '@/lib/action-types';

export const metadata: Metadata = {
    title: 'Update User',
};

type Params = Promise<{ id: string }>;

export default async function UpdateUser({ params }: { params: Params }) {
    const { id } = await params;

    const result = await getUserAction({ id });

    if (!isServerActionSuccess(result)) {
        return <ServerActionError result={result} />;
    }

    const user = result.data;

    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                User
            </h1>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                Update
            </h2>

            <p className="leading-7">
                Update the user&apos;s details below. The email address is used
                to login to the account.
            </p>

            <UpdateUserForm user={user} />
        </main>
    );
}
