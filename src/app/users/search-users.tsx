'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { User } from 'lucide-react';
import type {
    SearchUsersResponse,
    UserSort,
} from '@/app/users/data/search-users';
import {
    SearchUsersForm,
    type SearchUsersFormValues,
} from '@/app/users/search-users-form';
import { SortUsersDropdown } from '@/app/users/sort-users-dropdown';
import { UserCard } from '@/app/users/user-card';
import { Button } from '@/components/ui/button';
import {
    Empty,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    EmptyDescription,
} from '@/components/ui/empty';
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
        const params = new URLSearchParams(searchParams);
        params.delete('page');
        params.delete('search');

        if (data.search) {
            params.set('search', data.search);
        }

        router.replace(`?${params.toString()}`);
    }

    function onSort(sort: UserSort) {
        const params = new URLSearchParams(searchParams);
        params.set('sort', sort);
        router.replace(`?${params.toString()}`);
    }

    function onPreviousPage() {
        const params = new URLSearchParams(searchParams);
        params.set('page', (request.page - 1).toString());
        router.replace(`?${params.toString()}`);
    }

    function onNextPage() {
        const params = new URLSearchParams(searchParams);
        params.set('page', (request.page + 1).toString());
        router.replace(`?${params.toString()}`);
    }

    return (
        <main className="mx-auto max-w-screen-sm space-y-6 p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
                Users
            </h1>

            <div className="flex gap-2">
                <SearchUsersForm search={request.search} onSubmit={onSearch} />
                <SortUsersDropdown sort={request.sort} onChange={onSort} />
            </div>

            <Button asChild className="w-full sm:w-auto">
                <Link href="/users/create">Create New</Link>
            </Button>

            {data.items.length ? (
                <div className="space-y-2">
                    {data.items.map((user) => (
                        <UserCard key={user.id} user={user} />
                    ))}
                </div>
            ) : (
                <Empty className="border border-dashed">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <User />
                        </EmptyMedia>
                        <EmptyTitle>No Results</EmptyTitle>
                        <EmptyDescription>
                            No users could be found.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
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
