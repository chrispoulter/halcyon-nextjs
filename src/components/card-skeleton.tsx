import clsx from 'clsx';
import { ButtonSkeleton } from '@/components/button-skeleton';
import { ButtonGroup } from '@/components/button-group';
import { Card, CardTitle, CardBody } from '@/components/card';

type CardSkeletonProps = React.PropsWithChildren<{ className?: string }>;

export const CardSkeleton = ({ className, children }: CardSkeletonProps) => (
    <Card role="status" className={clsx('animate-pulse', className)}>
        <CardTitle>
            <div className="h-7 w-5/12 bg-gray-200" />
        </CardTitle>
        <CardBody>{children}</CardBody>
        <ButtonGroup align="left">
            <ButtonSkeleton />
        </ButtonGroup>
        <span className="sr-only">Loading...</span>
    </Card>
);
