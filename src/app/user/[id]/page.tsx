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
    const result = await getUserAction({ id });

    if (!result?.data) {
        return (
            <main className="mx-auto max-w-screen-sm p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {JSON.stringify(result)}
                    </AlertDescription>
                </Alert>
            </main>
        );
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
