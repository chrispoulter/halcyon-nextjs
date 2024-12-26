import { Metadata } from 'next';
import Link from 'next/link';
import {
    AlertCircle,
    ArrowDownAZ,
    ArrowDownWideNarrow,
    ArrowUpAZ,
    Search,
} from 'lucide-react';
import { searchUsersAction } from '@/app/actions/searchUsersAction';
import { UserCard } from '@/app/user/user-card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';

export const metadata: Metadata = {
    title: 'Users',
};

type SearchParams = Promise<{
    page: string;
    size: string;
    sort: string;
    search: string;
}>;

const sortOptions = [
    {
        value: 'NAME_ASC',
        label: 'Name A-Z',
        icon: ArrowDownAZ,
    },
    {
        value: 'NAME_DESC',
        label: 'Name Z-A',
        icon: ArrowUpAZ,
    },
    {
        value: 'EMAIL_ADDRESS_ASC',
        label: 'Email Address A-Z',
        icon: ArrowDownAZ,
    },
    {
        value: 'EMAIL_ADDRESS_DESC',
        label: 'Email Address Z-A',
        icon: ArrowUpAZ,
    },
];

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
                <Link href="/user/create">Create New</Link>
            </Button>

            <div className="flex w-full items-center space-x-2">
                <Input type="search" placeholder="Search..." />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon">
                            <ArrowDownWideNarrow />
                            <span className="sr-only">Toggle sort</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        {sortOptions.map(({ label, value, icon: Icon }) => (
                            <DropdownMenuItem
                                key={value}
                                asChild
                                disabled={sort === value}
                            >
                                <Link
                                    href={{
                                        pathname: '/user',
                                        query: {
                                            page,
                                            size,
                                            sort: value,
                                            search,
                                        },
                                    }}
                                >
                                    <Icon />
                                    <span>{label}</span>
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button type="submit" size="icon">
                    <Search />
                    <span className="sr-only">Search users</span>
                </Button>
            </div>

            <div className="space-y-2">
                {result.items.map((user) => (
                    <UserCard key={user.id} user={user} />
                ))}
            </div>

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
