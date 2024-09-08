import rht, { resolveValue, useToaster } from 'react-hot-toast';
import clsx from 'clsx';
import { CloseIcon } from '@/components/close-icon';

export const Toaster = () => {
    const { toasts } = useToaster({ duration: 5000 });

    if (!toasts.length) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed inset-3 flex flex-col items-end justify-end gap-3">
            {toasts
                .filter(toast => toast.visible)
                .map(toast => (
                    <div
                        key={toast.id}
                        role="alert"
                        className={clsx(
                            'pointer-events-auto flex w-full items-center justify-between border px-5 py-3 text-sm font-normal shadow sm:max-w-sm',
                            {
                                'border-green-800 bg-green-50 text-green-800':
                                    toast.type === 'success',
                                'border-red-800 bg-red-50 text-red-800':
                                    toast.type === 'error'
                            }
                        )}
                    >
                        <div>{resolveValue(toast.message, toast)}</div>
                        <button
                            type="button"
                            onClick={() => rht.dismiss(toast.id)}
                            aria-label="Close"
                            className={clsx(
                                '-mr-4 mb-auto px-2 py-1 focus:text-cyan-700 focus:outline-none focus:ring-1 focus:ring-cyan-500',
                                {
                                    'text-green-800 hover:text-green-900 focus:text-green-900':
                                        toast.type === 'success',
                                    'text-red-800 hover:text-red-900 focus:text-red-900':
                                        toast.type === 'error'
                                }
                            )}
                        >
                            <CloseIcon className="h-5 w-5" />
                        </button>
                    </div>
                ))}
        </div>
    );
};
