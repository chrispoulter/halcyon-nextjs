import { Metadata } from 'next';
import { AlertCircle } from 'lucide-react';
import { getUserAction } from '@/app/actions/getUserAction';
import { UpdateUserForm } from '@/app/user/[id]/update-user-form';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export const metadata: Metadata = {
    title: 'Update User',
};

type Params = Promise<{ id: string }>;

export default async function ResetPassword({ params }: { params: Params }) {
    const { id } = await params;
    const user = await getUserAction({ id });

    if ('errors' in user) {
        return (
            <main className="mx-auto max-w-screen-sm p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {JSON.stringify(user.errors)}
                    </AlertDescription>
                </Alert>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-screen-sm p-6">
            <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                Update User
            </h1>

            <p className="mt-6 leading-7">
                Update the user&apos;s details below. The email address is used
                to login to the account.
            </p>

            <UpdateUserForm user={user} className="mt-6" />
        </main>
    );
}
