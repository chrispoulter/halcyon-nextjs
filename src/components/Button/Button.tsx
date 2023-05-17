import clsx from 'clsx';
import { LoadingIcon } from '@/components/Icons/LoadingIcon';

type ButtonProps = React.PropsWithChildren<{
    variant?: 'primary' | 'danger' | 'warning' | 'secondary';
    type?: 'submit' | 'button';
    loading?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}>;

export const Button = ({
    variant = 'primary',
    type = 'button',
    loading,
    disabled,
    children,
    ...props
}: ButtonProps) => (
    <button
        {...props}
        type={type}
        disabled={loading || disabled}
        className={clsx(
            'relative h-full w-full bg-cyan-600 px-5 py-2 font-light focus:outline-none focus:ring-1 sm:w-auto sm:py-1',
            {
                'bg-cyan-600 text-white hover:bg-cyan-700 focus:bg-cyan-700 focus:ring-cyan-500':
                    variant === 'primary',
                'bg-red-600 text-white hover:bg-red-700 focus:bg-red-700 focus:ring-red-500':
                    variant === 'danger',
                'bg-yellow-600 text-white hover:bg-yellow-700 focus:bg-yellow-700 focus:ring-yellow-500':
                    variant === 'warning',
                ' bg-gray-300 text-gray-800 hover:bg-gray-200 focus:bg-gray-200 focus:ring-cyan-500':
                    variant === 'secondary',
                'opacity-50': loading || disabled
            }
        )}
    >
        {loading && (
            <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
                <LoadingIcon className="h-5 w-5 animate-spin text-current sm:h-4 sm:w-4" />
            </div>
        )}

        <div
            className={clsx({
                invisible: loading
            })}
        >
            {children}
        </div>
    </button>
);
