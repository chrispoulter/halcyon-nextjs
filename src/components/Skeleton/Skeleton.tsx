import clsx from 'clsx';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { Card, CardBody, CardTitle } from '@/components/Card/Card';
import { Container } from '@/components/Container/Container';
import { PageTitle } from '@/components/PageTitle/PageTitle';

type SkeletonProps = { className?: string };

export const InputSkeleton = ({ className }: SkeletonProps) => (
    <div className={className}>
        <div className="mb-2 h-5 w-4/12 bg-gray-200" />
        <div className="h-11 w-full border bg-gray-100 sm:h-9" />
    </div>
);

export const ToggleGroupSkeleton = ({ className }: SkeletonProps) => (
    <div className={className}>
        <div className="mb-2 h-5 w-3/12 bg-gray-200" />
        {[...Array(2)].map((_, index) => (
            <div
                key={index}
                className="mb-2 flex w-full items-center justify-between gap-5 border px-5 py-3 sm:py-2"
            >
                <div className="w-full">
                    <div className="mb-1 h-5 w-3/12 bg-gray-200" />
                    <div className="h-5 w-9/12 bg-gray-100" />
                </div>
                <div className="inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-gray-200" />
            </div>
        ))}
    </div>
);

export const ButtonSkeleton = () => (
    <div className="h-10 w-full bg-gray-200 sm:h-8 sm:w-28" />
);

export const ButtonGroupSkeleton = () => (
    <ButtonGroup role="status" className="animate-pulse">
        <ButtonSkeleton />
        <span className="sr-only">Loading...</span>
    </ButtonGroup>
);

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

type CardSkeletonProps = React.PropsWithChildren<SkeletonProps>;

export const CardSkeleton = ({ className, children }: CardSkeletonProps) => (
    <Card role="status" className={clsx('animate-pulse', className)}>
        <CardTitle>
            <div className=" h-7 w-5/12 bg-gray-200" />
        </CardTitle>
        <CardBody>{children}</CardBody>
        <ButtonGroup align="left">
            <ButtonSkeleton />
        </ButtonGroup>
        <span className="sr-only">Loading...</span>
    </Card>
);

export const PageSkeleton = () => (
    <Container role="status" className="animate-pulse">
        <PageTitle>
            <div className="h-8 w-4/12 bg-gray-200" />
        </PageTitle>

        <div className="mb-1 h-5 w-full bg-gray-100" />
        <div className="mb-3 h-5 w-7/12 bg-gray-100" />
        <div className="mb-1 h-5 w-full bg-gray-100" />
        <div className="mb-1 h-5 w-full bg-gray-100" />
        <div className="mb-3 h-5 w-7/12 bg-gray-100" />
        <div className="mb-1 h-5 w-full bg-gray-100" />
        <div className="mb-1 h-5 w-full bg-gray-100" />
        <div className="mb-3 h-5 w-7/12 bg-gray-100" />
        <div className="mb-1 h-5 w-full bg-gray-100" />
        <div className="mb-1 h-5 w-full bg-gray-100" />
        <div className="mb-3 h-5 w-7/12 bg-gray-100" />
        <div className="mb-1 h-5 w-full bg-gray-100" />
        <div className="mb-1 h-5 w-full bg-gray-100" />
        <div className="mb-3 h-5 w-7/12 bg-gray-100" />
        <div className="mb-1 h-5 w-full bg-gray-100" />
        <div className="mb-1 h-5 w-full bg-gray-100" />
        <div className="mb-3 h-5 w-7/12 bg-gray-100" />
        <div className="mb-1 h-5 w-full bg-gray-100" />
        <div className="h-5 w-7/12 bg-gray-100" />
        <span className="sr-only">Loading...</span>
    </Container>
);
