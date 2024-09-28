import { cn } from '@/lib/utils';

type BadgeProps = React.PropsWithChildren<{
    variant?: 'primary' | 'danger';
}>;

export const Badge = ({ variant = 'primary', children }: BadgeProps) => (
    <span
        className={cn(
            'border px-4 py-1 text-center text-xs font-medium uppercase leading-none',
            {
                'border-cyan-600 text-cyan-600': variant === 'primary',
                'border-red-600 text-red-600': variant === 'danger'
            }
        )}
    >
        {children}
    </span>
);
