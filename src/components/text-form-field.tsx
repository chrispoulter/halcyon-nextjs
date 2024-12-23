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

type TextFormFieldProps = {
    field: string;
    label: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function TextFormField({
    field,
    label,
    className,
    ...props
}: TextFormFieldProps) {
    const form = useFormContext();

    return (
        <FormField
            control={form.control}
            name={field}
            render={({ field }) => (
                <FormItem className={className}>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input {...field} {...props} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
