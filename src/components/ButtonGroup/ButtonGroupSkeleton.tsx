import { ButtonSkeleton } from '@/components/Button/ButtonSkeleton';
import { ButtonGroup } from './ButtonGroup';

export const ButtonGroupSkeleton = () => (
    <ButtonGroup role="status" className="animate-pulse">
        <ButtonSkeleton />
        <span className="sr-only">Loading...</span>
    </ButtonGroup>
);
