import Link from 'next/link';
import { cn } from '@/lib/utils';

type ButtonLinkProps = React.PropsWithChildren<{
    href: string;
    variant?: 'primary' | 'secondary';
    size?: 'lg';
}>;

export const ButtonLink = ({
    href,
    variant = 'primary',
    size,
    children
}: ButtonLinkProps) => (
    <Link
        href={href}
        className={cn(
            'block px-5 py-2 text-center font-light focus:outline-none focus:ring-1 sm:py-1',
            {
                'bg-cyan-600 text-white hover:bg-cyan-700 focus:bg-cyan-700 focus:ring-cyan-500':
                    variant === 'primary',
                'bg-gray-300 text-gray-800 hover:bg-gray-200 focus:bg-gray-200 focus:ring-cyan-500':
                    variant === 'secondary',
                'text-xl sm:py-2': size === 'lg'
            }
        )}
    >
        {children}
    </Link>
);
