import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

type SearchUserFormProps = {
    hasPreviousPage: any;
    hasNextPage: any;
    page: any;
    size: any;
    sort: any;
    search: any;
};

export function UserPagination({
    hasPreviousPage,
    hasNextPage,
    page,
    size,
    sort,
    search,
}: SearchUserFormProps) {
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
                                pathname: '/user',
                                query: {
                                    page: page - 1,
                                    size,
                                    sort,
                                    search,
                                },
                            }}
                        />
                    </PaginationItem>
                )}
                {hasNextPage && (
                    <PaginationItem>
                        <PaginationNext
                            href={{
                                pathname: '/user',
                                query: {
                                    page: page + 1,
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
    );
}
