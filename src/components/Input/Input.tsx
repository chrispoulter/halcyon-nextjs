import { Control, useController } from 'react-hook-form';
import clsx from 'clsx';
import { CloseIcon } from '@/components/Icons/CloseIcon';
import { parseForInput, formatForInput } from '@/utils/dates';

type InputProps = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'name' | 'min' | 'max'
> & {
    control: Control<any, any>;
    name: string;
    label: string;
    hideLabel?: boolean;
    min?: number | string | Date;
    max?: number | string | Date;
    onClear?: () => void;
};

type InputValueTransform = {
    [key: string]: {
        input: (value: string) => string;
        output: (e: React.ChangeEvent<HTMLInputElement>) => void;
    };
};

const transformers: InputValueTransform = {
    date: {
        input: value => (value ? formatForInput(value) : ''),
        output: e =>
            e.currentTarget.value
                ? parseForInput(e.currentTarget.value)
                : undefined
    },
    text: {
        input: value => value || '',
        output: e => (e.currentTarget.value ? e.currentTarget.value : undefined)
    }
};

export const Input = ({
    control,
    name,
    type = 'text',
    label,
    hideLabel,
    className,
    onClear,
    ...props
}: InputProps) => {
    const {
        field,
        fieldState: { error },
        formState: { isSubmitting }
    } = useController({
        name,
        control
    });

    const transform = transformers[type] || transformers.text;

    const onClearInput = () => {
        field.onChange('');
        onClear && onClear();
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        field.onChange(transform.output(e));

    const value = transform.input(field.value);

    const min =
        props.min instanceof Date ? formatForInput(props.min) : props.min;

    const max =
        props.max instanceof Date ? formatForInput(props.max) : props.max;

    const isSearch = type === 'search' && value;

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
                    name={field.name}
                    type={type}
                    value={value}
                    disabled={props.disabled || isSubmitting}
                    aria-invalid={!!error}
                    min={min}
                    max={max}
                    onChange={onChange}
                    className={clsx(
                        'block w-full border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm',
                        {
                            'border-red-600 bg-red-50 focus:border-red-600 focus:ring-red-500':
                                error,
                            'pr-8': isSearch
                        }
                    )}
                />

                {isSearch && (
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
                <span role="alert" className="mt-2 text-sm text-red-600">
                    {error.message}
                </span>
            )}
        </div>
    );
};
