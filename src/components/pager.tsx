import { Button } from '@/components/button';
import { ButtonGroup } from '@/components/button-group';
import { ButtonGroupSkeleton } from '@/components/button-group-skeleton';

type PagerProps = {
    isLoading?: boolean;
    isFetching?: boolean;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    onNextPage: () => void;
    onPreviousPage: () => void;
};

export const Pager = ({
    isLoading,
    isFetching,
    hasNextPage,
    hasPreviousPage,
    onNextPage,
    onPreviousPage
}: PagerProps) => {
    if (isLoading) {
        return <ButtonGroupSkeleton />;
    }

    if (!hasNextPage && !hasPreviousPage) {
        return null;
    }

    return (
        <ButtonGroup>
            {hasPreviousPage && (
                <Button
                    variant="secondary"
                    disabled={isFetching}
                    onClick={onPreviousPage}
                >
                    Previous
                </Button>
            )}
            {hasNextPage && (
                <Button
                    variant="secondary"
                    disabled={isFetching}
                    onClick={onNextPage}
                >
                    Next
                </Button>
            )}
        </ButtonGroup>
    );
};
