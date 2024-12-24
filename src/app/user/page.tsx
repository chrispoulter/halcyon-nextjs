import { Metadata } from 'next';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { searchUsersAction } from '@/app/actions/searchUsersAction';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { UserRoles } from '@/components/user-roles';

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
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Users
            </h1>

            <Button asChild variant="secondary" className="w-full sm:w-auto">
                <Link href="/user/create">Create User</Link>
            </Button>

            {result.items.map((user) => (
                <Link
                    key={user.id}
                    href={`/user/${user.id}`}
                    className="block border p-6"
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
                        <UserRoles roles={user.roles} />
                    </div>
                </Link>
            ))}

            {result.hasPreviousPage || result.hasNextPage ? (
                <Pagination>
                    <PaginationContent>
                        {result.hasPreviousPage && (
                            <PaginationItem>
                                <PaginationPrevious
                                    href={{
                                        pathname: '/user',
                                        query: {
                                            page: parseInt(page ?? 1) - 1,
                                            size,
                                            sort,
                                            search,
                                        },
                                    }}
                                />
                            </PaginationItem>
                        )}
                        {result.hasNextPage && (
                            <PaginationItem>
                                <PaginationNext
                                    href={{
                                        pathname: '/user',
                                        query: {
                                            page: parseInt(page ?? '1') + 1,
                                            size,
                                            sort,
                                            search,
                                        },
                                    }}
                                />
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </Pagination>
            ) : null}
        </main>
    );
}
