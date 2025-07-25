import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { isInPast, toDateOnly } from '@/lib/dates';
import { cn } from '@/lib/utils';

type DateFormFieldProps = {
    name: string;
    label: string;
    required?: boolean;
    disabled?: boolean;
    autoComplete?: [string, string, string];
};

export function DateFormField({ name, label, disabled }: DateFormFieldProps) {
    return (
        <FormField
            name={name}
            render={({ field }) => {
                function onSelect(date?: Date) {
                    const value = toDateOnly(date);
                    field.onChange(value);
                }

                function isDisabled(date: Date) {
                    return !isInPast(date);
                }

                return (
                    <FormItem className="flex flex-col">
                        <FormLabel>{label}</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant={'outline'}
                                        disabled={disabled}
                                        className={cn(
                                            'w-full pl-3 text-left font-normal',
                                            !field.value &&
                                                'text-muted-foreground'
                                        )}
                                    >
                                        {field.value ? (
                                            format(field.value, 'PPP')
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={onSelect}
                                    disabled={isDisabled}
                                    captionLayout="dropdown"
                                />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
}
