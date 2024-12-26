'use client';

import { useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

type SearchUserFormProps = {
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    page?: number;
};

export function UserPagination({
    hasPreviousPage,
    hasNextPage,
    page = 1,
}: SearchUserFormProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createQueryString = useCallback(
        (name: string, value?: number) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(name, value.toString());
            } else {
                params.delete(name);
            }
            return params.toString();
        },
        [searchParams]
    );

    if (!hasPreviousPage && !hasNextPage) {
        return null;
    }

    return (
        <Pagination>
            <PaginationContent>
                {hasPreviousPage && (
                    <PaginationItem>
                        <PaginationPrevious
                            href={`${pathname}?${createQueryString('page', page - 1)}`}
                        />
                    </PaginationItem>
                )}
                {hasNextPage && (
                    <PaginationItem>
                        <PaginationNext
                            href={`${pathname}?${createQueryString('page', page + 1)}`}
                        />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
}
