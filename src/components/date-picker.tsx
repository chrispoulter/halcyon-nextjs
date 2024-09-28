import { useState } from 'react';
import { Control, useController } from 'react-hook-form';
import { currentYear, monthNames } from '@/lib/dates';
import { cn } from '@/lib/utils';

type DatePickerProps = {
    control: Control<any, any>;
    name: string;
    label: string;
    required?: boolean;
    disabled?: boolean;
    autoComplete?: string[];
    className?: string;
};

type DatePickerState = {
    year?: string;
    month?: string;
    date?: string;
};

export const DatePicker = ({
    control,
    name,
    label,
    required,
    disabled,
    autoComplete,
    className
}: DatePickerProps) => {
    const {
        field,
        fieldState: { error }
    } = useController({
        name,
        control
    });

    const initialState: DatePickerState = {
        year: undefined,
        month: undefined,
        date: undefined
    };

    if (field.value) {
        const [year, month, date] = field.value.split('-');
        initialState.year = year;
        initialState.month = month;
        initialState.date = date;
    }

    const [state, setState] = useState(initialState);

    const handleYear = (year: string) => handleChange({ ...state, year });

    const handleMonth = (month: string) => handleChange({ ...state, month });

    const handleDay = (date: string) => handleChange({ ...state, date });

    const handleChange = (input: DatePickerState) => {
        setState(input);

        field.onChange({
            target: {
                name: field.name,
                value: `${input.year}-${input.month}-${input.date}`
            }
        });
    };

    return (
        <div className={cn('w-full', className)}>
            <label
                htmlFor={`${name}.date`}
                className={cn('mb-2 block text-sm font-medium text-gray-800', {
                    'text-red-600': error
                })}
            >
                {label}
            </label>

            <div className="flex w-full gap-1">
                <select
                    id={`${name}.date`}
                    value={state.date}
                    required={required}
                    disabled={disabled}
                    aria-label={`${label} Date`}
                    aria-invalid={!!error}
                    autoComplete={autoComplete && autoComplete[0]}
                    onChange={event => handleDay(event.target.value)}
                    onBlur={field.onBlur}
                    className={cn(
                        'block w-full border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm',
                        {
                            'border-red-600 bg-red-50 focus:border-red-600 focus:ring-red-500':
                                error
                        }
                    )}
                >
                    <option>Day...</option>
                    {Array.from({ length: 31 }).map((_, index) => (
                        <option key={index}>
                            {(index + 1).toString().padStart(2, '0')}
                        </option>
                    ))}
                </select>
                <select
                    id={`${name}.month`}
                    value={state.month}
                    required={required}
                    disabled={disabled}
                    aria-label={`${label} Month`}
                    aria-invalid={!!error}
                    autoComplete={autoComplete && autoComplete[1]}
                    onChange={event => handleMonth(event.target.value)}
                    onBlur={field.onBlur}
                    className={cn(
                        'block w-full border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm',
                        {
                            'border-red-600 bg-red-50 focus:border-red-600 focus:ring-red-500':
                                error
                        }
                    )}
                >
                    <option>Month...</option>
                    {Array.from({ length: 12 }).map((_, index) => (
                        <option
                            key={index}
                            value={(index + 1).toString().padStart(2, '0')}
                        >
                            {monthNames[index]}
                        </option>
                    ))}
                </select>
                <select
                    id={`${name}.year`}
                    value={state.year}
                    required={required}
                    disabled={disabled}
                    aria-label={`${label} Year`}
                    aria-invalid={!!error}
                    autoComplete={autoComplete && autoComplete[2]}
                    onChange={event => handleYear(event.target.value)}
                    onBlur={field.onBlur}
                    className={cn(
                        'block w-full border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm',
                        {
                            'border-red-600 bg-red-50 focus:border-red-600 focus:ring-red-500':
                                error
                        }
                    )}
                >
                    <option>Year...</option>
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
