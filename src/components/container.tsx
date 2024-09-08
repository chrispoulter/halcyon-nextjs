import clsx from 'clsx';

type ContainerProps = React.PropsWithChildren<{
    role?: string;
    className?: string;
}>;

export const Container = ({ role, className, children }: ContainerProps) => (
    <section
        role={role}
        className={clsx('container mx-auto max-w-screen-md p-3', className)}
    >
        {children}
    </section>
);
