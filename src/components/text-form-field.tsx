import { InputHTMLAttributes } from 'react';
import { FieldPath, FieldValues, useFormContext } from 'react-hook-form';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type TextFormFieldProps<TFieldValues extends FieldValues> = {
    field: FieldPath<TFieldValues>;
    label: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function TextFormField<TFieldValues extends FieldValues>({
    field,
    label,
    className,
    ...props
}: TextFormFieldProps<TFieldValues>) {
    const form = useFormContext<TFieldValues>();

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
