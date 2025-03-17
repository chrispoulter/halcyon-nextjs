import type { FieldValues, UseControllerProps } from 'react-hook-form';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type TextFormFieldProps<TFieldValues extends FieldValues> = {
    label: string;
    type?: string;
    maxLength?: number;
    autoComplete?: string;
    required?: boolean;
    className?: string;
} & UseControllerProps<TFieldValues>;

export function TextFormField<TFieldValues extends FieldValues>({
    control,
    name,
    label,
    className,
    ...props
}: TextFormFieldProps<TFieldValues>) {
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
