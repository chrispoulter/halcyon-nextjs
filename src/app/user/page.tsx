import { Metadata } from 'next';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { searchUsersAction } from '@/app/actions/searchUsersAction';
import { SearchUserForm } from '@/app/user/search-user-form';
import { UserPagination } from '@/app/user/user-pagination';
import { UserCard } from '@/app/user/user-card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { z } from 'zod';

export const metadata: Metadata = {
    title: 'Users',
};

type SearchParams = Promise<{
    page?: number;
    size?: number;
    sort: string;
    search: string;
}>;

const searchParamsSchema = z.object({
    search: z.string().catch(''),
    page: z.coerce.number().int().positive().catch(1),
    sort: z.string().catch('NAME_ASC'),
});

export default async function UserSearch({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const params = await searchParams;
    const request = searchParamsSchema.parse(params);
    const result = await searchUsersAction({ ...request, size: 10 });

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
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Users
            </h1>

            <Button asChild variant="secondary" className="w-full sm:w-auto">
                <Link href="/user/create">Create New</Link>
            </Button>

            <SearchUserForm sort={request.sort} search={request.search} />

            <div className="space-y-2">
                {result.items.map((user) => (
                    <UserCard key={user.id} user={user} />
                ))}
            </div>

            <UserPagination
                hasPreviousPage={result.hasPreviousPage}
                hasNextPage={result.hasNextPage}
                page={request.page}
            />
        </main>
    );
}
