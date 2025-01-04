'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowDownWideNarrow } from 'lucide-react';
import { UserSort } from '@/app/user/user-types';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const sortOptions = [
    {
        value: UserSort.NAME_ASC,
        label: 'Name A-Z',
    },
    {
        value: UserSort.NAME_DESC,
        label: 'Name Z-A',
    },
    {
        value: UserSort.EMAIL_ADDRESS_ASC,
        label: 'Email Address A-Z',
    },
    {
        value: UserSort.EMAIL_ADDRESS_DESC,
        label: 'Email Address Z-A',
    },
];

type SortUserDropdownProps = {
    sort?: UserSort;
};

export function SortUserDropdown({ sort }: SortUserDropdownProps) {
    const pathname = usePathname();

    const searchParams = useSearchParams();

    const query = Object.fromEntries(searchParams.entries());

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon">
                    <ArrowDownWideNarrow />
                    <span className="sr-only">Toggle sort</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                {sortOptions.map(({ label, value }) => (
                    <DropdownMenuItem
                        key={value}
                        asChild
                        disabled={sort === value}
                    >
                        <Link
                            href={{
                                pathname,
                                query: {
                                    ...query,
                                    sort: value,
                                },
                            }}
                        >
                            {label}
                        </Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
