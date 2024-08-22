import { Button } from '@/components/Button/Button';
import { ButtonGroup } from '@/components/Button/ButtonGroup';
import { ButtonGroupSkeleton } from '@/components/Button/ButtonGroupSkeleton';

type PagerProps = {
    isLoading?: boolean;
    isFetching?: boolean;
    hasNextPage?: boolean;
    onNextPage: () => void;
};

export const Pager = ({
    isLoading,
    isFetching,
    hasNextPage,
    onNextPage
}: PagerProps) => {
    if (isLoading) {
        return <ButtonGroupSkeleton />;
    }

    if (!hasNextPage) {
        return null;
    }

    return (
        <ButtonGroup>
            <Button
                variant="secondary"
                loading={isFetching}
                onClick={onNextPage}
            >
                More...
            </Button>
        </ButtonGroup>
    );
};
