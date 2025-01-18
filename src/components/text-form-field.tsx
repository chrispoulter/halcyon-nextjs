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
    name: FieldPath<TFieldValues>;
    label: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function TextFormField<TFieldValues extends FieldValues>({
    name,
    label,
    className,
    ...props
}: TextFormFieldProps<TFieldValues>) {
    const { control } = useFormContext<TFieldValues>();

    return (
        <FormField
            control={control}
            name={name}
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
