import { FieldPath, FieldValues, useFormContext } from 'react-hook-form';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { currentYear, monthNames } from '@/lib/dates';

type DateFormFieldProps<TFieldValues extends FieldValues> = {
    field: FieldPath<TFieldValues>;
    label: string;
    required?: boolean;
    disabled?: boolean;
    autoComplete?: [string, string, string];
    className?: string;
};

export function DateFormField<TFieldValues extends FieldValues>({
    field,
    label,
    required,
    disabled,
    autoComplete,
    className,
}: DateFormFieldProps<TFieldValues>) {
    const form = useFormContext<TFieldValues>();

    return (
        <FormField
            control={form.control}
            name={field}
            render={({ field }) => {
                const day = field.value?.split('-')[2] ?? '';
                const month = field.value?.split('-')[1] ?? '';
                const year = field.value?.split('-')[0] ?? '';

                function onDayChange(value: string) {
                    field.onChange(`${year}-${month}-${value}`);
                }

                function onMonthChange(value: string) {
                    field.onChange(`${year}-${value}-${day}`);
                }

                function onYearChange(value: string) {
                    field.onChange(`${value}-${month}-${day}`);
                }

                return (
                    <FormItem className={className}>
                        <FormLabel>{label}</FormLabel>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <Select
                                    onValueChange={onDayChange}
                                    defaultValue={day}
                                    required={required}
                                    disabled={disabled}
                                    autoComplete={
                                        autoComplete && autoComplete[0]
                                    }
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Day..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Array.from({ length: 31 }).map(
                                            (_, index) => (
                                                <SelectItem
                                                    key={index}
                                                    value={(index + 1)
                                                        .toString()
                                                        .padStart(2, '0')}
                                                >
                                                    {(index + 1)
                                                        .toString()
                                                        .padStart(2, '0')}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex-1">
                                <Select
                                    onValueChange={onMonthChange}
                                    defaultValue={month}
                                    required={required}
                                    disabled={disabled}
                                    autoComplete={
                                        autoComplete && autoComplete[1]
                                    }
                                >
                                    <FormControl id={`${field.name}-month`}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Month..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Array.from({ length: 12 }).map(
                                            (_, index) => (
                                                <SelectItem
                                                    key={index}
                                                    value={(index + 1)
                                                        .toString()
                                                        .padStart(2, '0')}
                                                >
                                                    {monthNames[index]}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex-1">
                                <Select
                                    onValueChange={onYearChange}
                                    defaultValue={year}
                                    required={required}
                                    disabled={disabled}
                                    autoComplete={
                                        autoComplete && autoComplete[2]
                                    }
                                >
                                    <FormControl id={`${field.name}-year`}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Year..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Array.from({ length: 120 }).map(
                                            (_, index) => (
                                                <SelectItem
                                                    key={index}
                                                    value={(
                                                        currentYear - index
                                                    ).toString()}
                                                >
                                                    {currentYear - index}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
}
