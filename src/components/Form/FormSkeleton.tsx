import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { InputSkeleton } from '@/components/Input/InputSkeleton';
import { ButtonSkeleton } from '@/components/Button/ButtonSkeleton';

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
