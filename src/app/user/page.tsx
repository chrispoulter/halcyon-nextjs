import { Metadata } from 'next';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { searchUsersAction } from '@/app/actions/searchUsersAction';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
    title: 'Users',
};

type SearchParams = Promise<{
    page: string;
    size: string;
    sort: string;
    search: string;
}>;

export default async function UserSearch({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const { page, size, sort, search } = await searchParams;

    const result = await searchUsersAction({ page, size, sort, search });

    if ('errors' in result) {
        return (
            <main className="mx-auto max-w-screen-sm p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {JSON.stringify(result.errors)}
                    </AlertDescription>
                </Alert>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-screen-sm p-6">
            <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                Users
            </h1>

            {result.items.map((user) => (
                <Link
                    key={user.id}
                    href={`/user/${user.id}`}
                    className="mt-6 block border p-6"
                >
                    <div className="block font-semibold leading-7">
                        {user.firstName} {user.lastName}
                    </div>
                    <div className="block leading-7">{user.emailAddress}</div>
                    <div className="flex flex-col gap-2">
                        {user.isLockedOut && (
                            <Badge
                                variant="destructive"
                                className="justify-center"
                            >
                                Locked
                            </Badge>
                        )}
                        {user.roles?.map((role) => (
                            <Badge
                                key={role}
                                variant="secondary"
                                className="justify-center"
                            >
                                {role}
                            </Badge>
                        ))}
                    </div>
                </Link>
            ))}
        </main>
    );
}
