'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

type PagerProps = {
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    page?: number;
};

export function Pager({ hasPreviousPage, hasNextPage, page = 1 }: PagerProps) {
    const pathname = usePathname();

    const searchParams = useSearchParams();

    const query = Object.fromEntries(searchParams.entries());

    if (!hasPreviousPage && !hasNextPage) {
        return null;
    }

    return (
        <Pagination>
            <PaginationContent>
                {hasPreviousPage && (
                    <PaginationItem>
                        <PaginationPrevious
                            href={{
                                pathname,
                                query: {
                                    ...query,
                                    page: page - 1,
                                },
                            }}
                        />
                    </PaginationItem>
                )}
                {hasNextPage && (
                    <PaginationItem>
                        <PaginationNext
                            href={{
                                pathname,
                                query: {
                                    ...query,
                                    page: page + 1,
                                },
                            }}
                        />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
}
