import clsx from 'clsx';

type CardProps = React.PropsWithChildren<{
    role?: string;
    className?: string;
}>;

export const Card = ({ role, className, children }: CardProps) => (
    <div role={role} className={clsx('border p-5', className)}>
        {children}
    </div>
);

export const CardTitle = ({ children }: React.PropsWithChildren) => (
    <h2 className="mb-3 text-xl font-light leading-tight text-gray-900">
        {children}
    </h2>
);

export const CardBody = ({ children }: React.PropsWithChildren) => (
    <div className="mb-3 text-sm text-gray-600">{children}</div>
);
