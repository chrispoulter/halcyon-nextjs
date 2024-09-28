import { cn } from '@/lib/utils';

type ContainerProps = React.PropsWithChildren<{
    role?: string;
    className?: string;
}>;

export const Container = ({ role, className, children }: ContainerProps) => (
    <section
        role={role}
        className={cn('container mx-auto max-w-screen-md p-3', className)}
    >
        {children}
    </section>
);
