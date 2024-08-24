import { Button } from '@/components/Button/Button';
import { ButtonGroup } from '@/components/Button/ButtonGroup';
import { ButtonGroupSkeleton } from '@/components/Button/ButtonGroupSkeleton';

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
