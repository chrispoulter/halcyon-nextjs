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
    onPreviousPage: () => void;
    onNextPage: () => void;
};

export function Pager({
    hasPreviousPage,
    hasNextPage,
    onPreviousPage,
    onNextPage,
}: PagerProps) {
    if (!hasPreviousPage && !hasNextPage) {
        return null;
    }

    return (
        <Pagination>
            <PaginationContent>
                {hasPreviousPage && (
                    <PaginationItem>
                        <PaginationPrevious onClick={onPreviousPage} />
                    </PaginationItem>
                )}
                {hasNextPage && (
                    <PaginationItem>
                        <PaginationNext onClick={onNextPage} />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
}
