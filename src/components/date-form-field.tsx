import { InputHTMLAttributes } from 'react';
import { useFormContext } from 'react-hook-form';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type DateFormFieldProps = Omit<
    {
        field: string;
        label: string;
    } & InputHTMLAttributes<HTMLInputElement>,
    'type'
>;

export function DateFormField({
    field,
    label,
    className,
    ...props
}: DateFormFieldProps) {
    const form = useFormContext();

    return (
        <FormField
            control={form.control}
            name={field}
            render={({ field }) => (
                <FormItem className={className}>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input {...field} {...props} type="date" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
