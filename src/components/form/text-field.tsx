import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

interface TextFieldProps<T extends FieldValues>
    extends React.ComponentProps<'input'> {
    control: Control<T>;
    name: FieldPath<T>;
    label: string;
}

export function TextField<T extends FieldValues>({
    control,
    name,
    label,
    ...props
}: TextFieldProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={name}>{label}</FieldLabel>
                    <Input {...props} {...field} />
                    {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                    )}
                </Field>
            )}
        />
    );
}
