import { useState } from 'react';
import clsx from 'clsx';
import { Control, useController } from 'react-hook-form';
import { currentYear, monthNames } from '@/utils/date';

type DatePickerProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
    control: Control<any, any>;
    name: string;
    label: string;
};

type DatePickerState = {
    year: number;
    month: number;
    date: number;
};

export const DatePicker = ({
    control,
    name,
    label,
    className,
    ...props
}: DatePickerProps) => {
    const {
        field,
        fieldState: { error },
        formState: { isSubmitting }
    } = useController({
        name,
        control
    });

    const dateValue = {
        year: -1,
        month: -1,
        date: -1
    };

    if (field.value) {
        const date = new Date(field.value);
        dateValue.year = date.getFullYear();
        dateValue.month = date.getMonth();
        dateValue.date = date.getDate();
    }

    const [state, setState] = useState<DatePickerState>(dateValue);

    const handleYear = (year: string) =>
        handleChange({ ...state, year: parseInt(year, 10) });

    const handleMonth = (month: string) =>
        handleChange({ ...state, month: parseInt(month, 10) });

    const handleDay = (date: string) =>
        handleChange({ ...state, date: parseInt(date, 10) });

    const handleChange = (input: DatePickerState) => {
        setState(input);

        const isDateSet =
            input.year > -1 && input.month > -1 && input.date > -1;

        const value = isDateSet
            ? new Date(input.year, input.month, input.date).toISOString() || ''
            : '';

        field.onChange(value);
    };

    return (
        <div className={clsx('w-full', className)}>
            <label
                htmlFor={`${name}.date`}
                className={clsx(
                    'mb-2 block text-sm font-medium text-gray-800',
                    {
                        'text-red-600': error
                    }
                )}
            >
                {label}
            </label>

            <div className="flex w-full gap-1">
                <select
                    id={`${name}.date`}
                    value={state.date}
                    disabled={props.disabled || isSubmitting}
                    aria-label={`${label} Date`}
                    aria-invalid={!!error}
                    onChange={event => handleDay(event.target.value)}
                    className={clsx(
                        'block w-full border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm',
                        {
                            'border-red-600 bg-red-50 focus:border-red-600 focus:ring-red-500':
                                error
                        }
                    )}
                >
                    <option value={-1}>Day...</option>
                    {Array.from({ length: 31 }).map((_, index) => (
                        <option key={index}>{index + 1}</option>
                    ))}
                </select>
                <select
                    id={`${name}.month`}
                    value={state.month}
                    disabled={props.disabled || isSubmitting}
                    aria-label={`${label} Month`}
                    aria-invalid={!!error}
                    onChange={event => handleMonth(event.target.value)}
                    className={clsx(
                        'block w-full border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm',
                        {
                            'border-red-600 bg-red-50 focus:border-red-600 focus:ring-red-500':
                                error
                        }
                    )}
                >
                    <option value={-1}>Month...</option>
                    {Array.from({ length: 12 }).map((_, index) => (
                        <option key={index} value={index}>
                            {monthNames[index]}
                        </option>
                    ))}
                </select>
                <select
                    id={`${name}.year`}
                    value={state.year}
                    disabled={props.disabled || isSubmitting}
                    aria-label={`${label} Year`}
                    aria-invalid={!!error}
                    onChange={event => handleYear(event.target.value)}
                    className={clsx(
                        'block w-full border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm',
                        {
                            'border-red-600 bg-red-50 focus:border-red-600 focus:ring-red-500':
                                error
                        }
                    )}
                >
                    <option value={-1}>Year...</option>
                    {Array.from({ length: 120 }).map((_, index) => (
                        <option key={index}>{currentYear - index}</option>
                    ))}
                </select>
            </div>

            {error && (
                <span role="alert" className="mt-2 text-sm text-red-600">
                    {error.message}
                </span>
            )}
        </div>
    );
};
