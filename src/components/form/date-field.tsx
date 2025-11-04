import { Controller } from 'react-hook-form';
import { CalendarIcon } from 'lucide-react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { isInPast, toDateOnly, toDisplay } from '@/lib/dates';
import { cn } from '@/lib/utils';

type DateFormFieldProps = {
    name: string;
    label: string;
    required?: boolean;
    disabled?: boolean;
};

export function DateFormField({
    name,
    label,
    required,
    disabled,
}: DateFormFieldProps) {
    return (
        <Controller
            name={name}
            render={({ field, fieldState }) => {
                function onSelect(date?: Date) {
                    const value = toDateOnly(date);
                    field.onChange(value);
                }

                function isDisabled(date: Date) {
                    return !isInPast(date);
                }

                return (
                    <Field
                        data-invalid={fieldState.invalid}
                        className="flex flex-col"
                    >
                        <FieldLabel>{label}</FieldLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={'outline'}
                                    disabled={disabled}
                                    className={cn(
                                        'w-full pl-3 text-left font-normal',
                                        !field.value && 'text-muted-foreground'
                                    )}
                                >
                                    {field.value ? (
                                        toDisplay(field.value)
                                    ) : (
                                        <span>Select...</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0"
                                align="start"
                            >
                                <Calendar
                                    timeZone="UTC"
                                    mode="single"
                                    selected={field.value}
                                    defaultMonth={field.value}
                                    required={required}
                                    onSelect={onSelect}
                                    disabled={isDisabled}
                                    captionLayout="dropdown"
                                />
                            </PopoverContent>
                        </Popover>
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                );
            }}
        />
    );
}
