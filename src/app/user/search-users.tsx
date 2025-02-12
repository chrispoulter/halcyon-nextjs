'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { type SearchUsersResponse, UserSort } from '@/app/user/user-types';
import {
    SearchUsersForm,
    type SearchUsersFormValues,
} from '@/app/user/search-users-form';
import { SortUsersDropdown } from '@/app/user/sort-users-dropdown';
import { UserCard } from '@/app/user/user-card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Pager } from '@/components/pager';

type SearchUsersProps = {
    request: {
        page: number;
        sort: UserSort;
        search: string;
    };
    data: SearchUsersResponse;
};

export function SearchUsers({ request, data }: SearchUsersProps) {
    const router = useRouter();

    const searchParams = useSearchParams();

    function onSearch(data: SearchUsersFormValues) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('page');
        params.delete('search');

        if (data.search) {
            params.set('search', data.search);
        }

        router.push(`?${params.toString()}`);
    }

    function onSort(sort: UserSort) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', sort);
        router.push(`?${params.toString()}`);
    }

    function onPreviousPage() {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', (request.page - 1).toString());
        router.push(`?${params.toString()}`);
    }

    function onNextPage() {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', (request.page + 1).toString());
        router.push(`?${params.toString()}`);
    }

    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Users
            </h1>

            <div className="flex gap-2">
                <SearchUsersForm search={request.search} onSubmit={onSearch} />
                <SortUsersDropdown sort={request.sort} onChange={onSort} />
            </div>

            <Button asChild className="w-full sm:w-auto">
                <Link href="/user/create">Create New</Link>
            </Button>

            {data.items.length ? (
                <div className="space-y-2">
                    {data.items.map((user) => (
                        <UserCard key={user.id} user={user} />
                    ))}
                </div>
            ) : (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No Results</AlertTitle>
                    <AlertDescription>
                        No users could be found.
                    </AlertDescription>
                </Alert>
            )}

            <Pager
                hasPreviousPage={data.hasPreviousPage}
                hasNextPage={data.hasNextPage}
                onPreviousPage={onPreviousPage}
                onNextPage={onNextPage}
            />
        </main>
    );
}
