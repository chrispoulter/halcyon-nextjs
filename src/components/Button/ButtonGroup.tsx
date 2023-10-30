import clsx from 'clsx';

type ButtonGroupProps = React.PropsWithChildren<{
    align?: 'left' | 'right';
    role?: string;
    className?: string;
}>;

export const ButtonGroup = ({
    align = 'right',
    role,
    children,
    className
}: ButtonGroupProps) => (
    <div
        role={role}
        className={clsx(
            'flex flex-col gap-2 sm:flex-row',
            {
                'justify-end': align === 'right',
                'justify-start': align === 'left'
            },
            className
        )}
    >
        {children}
    </div>
);
