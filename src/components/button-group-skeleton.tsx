import { ButtonSkeleton } from '@/components/button-skeleton';
import { ButtonGroup } from '@/components/button-group';

export const ButtonGroupSkeleton = () => (
    <ButtonGroup role="status" className="animate-pulse">
        <ButtonSkeleton />
        <span className="sr-only">Loading...</span>
    </ButtonGroup>
);
