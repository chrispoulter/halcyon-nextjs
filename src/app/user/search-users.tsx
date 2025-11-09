'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type {
    SearchUsersResponse,
    UserSort,
} from '@/app/user/data/search-users';
import {
    SearchUsersForm,
    type SearchUsersFormValues,
} from '@/app/user/search-users-form';
import { SortUsersDropdown } from '@/app/user/sort-users-dropdown';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTable } from '@/components/table/data-table';
import { Pager } from '@/components/pager';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';

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
                <Link href="/user/create">Create New</Link>
            </Button>

            <DataTable
                columns={[
                    {
                        id: 'select',
                        header: ({ table }) => (
                            <Checkbox
                                checked={
                                    table.getIsAllPageRowsSelected() ||
                                    (table.getIsSomePageRowsSelected() &&
                                        'indeterminate')
                                }
                                onCheckedChange={(value) =>
                                    table.toggleAllPageRowsSelected(!!value)
                                }
                                aria-label="Select all"
                            />
                        ),
                        cell: ({ row }) => (
                            <Checkbox
                                checked={row.getIsSelected()}
                                onCheckedChange={(value) =>
                                    row.toggleSelected(!!value)
                                }
                                aria-label="Select row"
                            />
                        ),
                        enableSorting: false,
                        enableHiding: false,
                    },
                    {
                        header: ({ column }) => (
                            <DataTableColumnHeader
                                column={column}
                                title="Email"
                            />
                        ),
                        accessorKey: 'emailAddress',
                    },
                    {
                        header: ({ column }) => (
                            <DataTableColumnHeader
                                column={column}
                                title="First Name"
                            />
                        ),
                        accessorKey: 'firstName',
                    },
                    {
                        header: ({ column }) => (
                            <DataTableColumnHeader
                                column={column}
                                title="Last Name"
                            />
                        ),
                        accessorKey: 'lastName',
                    },
                ]}
                data={data.items}
            />

            <Pager
                hasPreviousPage={data.hasPreviousPage}
                hasNextPage={data.hasNextPage}
                onPreviousPage={onPreviousPage}
                onNextPage={onNextPage}
            />
        </main>
    );
}
