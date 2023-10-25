import { ButtonGroup } from '@/components/Button/ButtonGroup';
import { ButtonSkeleton } from '@/components/Button/ButtonSkeleton';
import { InputSkeleton } from './InputSkeleton';

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
