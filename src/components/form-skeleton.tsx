import { ButtonGroup } from '@/components/button-group';
import { ButtonSkeleton } from '@/components/button-skeleton';
import { InputSkeleton } from '@/components/input-skeleton';

export const FormSkeleton = ({ children }: React.PropsWithChildren) => (
    <div role="status" className="animate-pulse">
        {children}
        <InputSkeleton className="mb-5" />
        <ButtonGroup>
            <ButtonSkeleton />
        </ButtonGroup>
        <span className="sr-only">Loading...</span>
    </div>
);
