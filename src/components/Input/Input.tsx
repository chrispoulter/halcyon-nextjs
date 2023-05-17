import clsx from 'clsx';
import { useField } from 'formik';
import { CloseIcon } from '@/components/Icons/CloseIcon';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    name: string;
    label: string;
    error?: string | false;
    hideLabel?: boolean;
    onClear?: (e?: React.FormEvent<HTMLFormElement>) => void;
};

export const Input = ({
    label,
    hideLabel,
    className,
    onClear,
    ...props
}: InputProps) => {
    const [field, meta] = useField(props);
    const error = meta.touched && meta.error;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        switch (props.type) {
            case 'date':
                return field.onChange({
                    target: {
                        name: field.name,
                        value: e.currentTarget.value
                            ? new Date(e.currentTarget.value).toISOString()
                            : e.currentTarget.value
                    }
                });

            default:
                return field.onChange(e);
        }
    };

    const onClearInput = () => {
        field.onChange({
            target: {
                name: field.name,
                value: ''
            }
        });

        onClear && onClear();
    };

    let value = field.value;

    switch (props.type) {
        case 'date':
            value = field.value.split('T')[0];
            break;
    }

    const showClear = props.type === 'search' && field.value;

    return (
        <div className={clsx('w-full', className)}>
            <label
                htmlFor={field.name}
                className={clsx(
                    'mb-2 block text-sm font-medium text-gray-800',
                    {
                        'text-red-600': error,
                        'sr-only': hideLabel
                    }
                )}
            >
                {label}
            </label>

            <div className="relative">
                <input
                    {...field}
                    {...props}
                    id={field.name}
                    value={value}
                    onChange={onChange}
                    className={clsx(
                        'block w-full border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm',
                        {
                            'border-red-600 bg-red-50 focus:border-red-600 focus:ring-red-500':
                                error,
                            'pr-8': showClear
                        }
                    )}
                />

                {showClear && (
                    <button
                        type="button"
                        aria-label="Clear"
                        disabled={props.disabled}
                        onClick={onClearInput}
                        className="absolute right-0 top-0 h-full px-2 py-1 text-gray-800 hover:text-gray-900 focus:text-gray-900 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    >
                        <CloseIcon className="h-4 w-4" />
                    </button>
                )}
            </div>

            {error && (
                <span className="mt-2 text-sm text-red-600">{error}</span>
            )}
        </div>
    );
};
