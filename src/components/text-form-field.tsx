import { Controller } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

type TextFormFieldProps = {
    name: string;
    label: string;
    type?: string;
    maxLength?: number;
    autoComplete?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
};

export function TextFormField({
    name,
    label,
    className,
    ...props
}: TextFormFieldProps) {
    return (
        <Controller
            name={name}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className={className}>
                    <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
                    <Input
                        {...field}
                        {...props}
                        aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                    )}
                </Field>
            )}
        />
    );
}
