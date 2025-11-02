import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { Controller } from 'react-hook-form';

type SwitchFormFieldProps = {
    name: string;
    disabled?: boolean;
    options: Record<string, { title: string; description: string }>;
};

export function SwitchFormField({
    name,
    options,
    disabled,
}: SwitchFormFieldProps) {
    return (
        <Controller
            name={name}
            render={({ field: { value = [], onChange }, fieldState }) => {
                return (
                    <Field data-invalid={fieldState.invalid}>
                        {Object.entries(options).map(
                            ([key, { title, description }]) => {
                                const checked = value.includes(key);

                                function onCheckChanged(checked: boolean) {
                                    if (checked) {
                                        return onChange([...value, key]);
                                    }

                                    return onChange(
                                        value.filter(
                                            (item: string) => item !== key
                                        )
                                    );
                                }

                                return (
                                    <div
                                        key={key}
                                        className="flex flex-row items-center justify-between rounded-lg border p-4"
                                    >
                                        <div className="space-y-0.5">
                                            <FieldLabel
                                                htmlFor={`${name}-${key}`}
                                                className="text-base"
                                            >
                                                {title}
                                            </FieldLabel>
                                            <FieldDescription>
                                                {description}
                                            </FieldDescription>
                                        </div>
                                        <Switch
                                            id={`${name}-${key}`}
                                            checked={checked}
                                            onCheckedChange={onCheckChanged}
                                            disabled={disabled}
                                        />
                                    </div>
                                );
                            }
                        )}
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                );
            }}
        />
    );
}
