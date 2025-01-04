import { FieldPath, FieldValues, useFormContext } from 'react-hook-form';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';

type SwitchFormFieldProps<TFieldValues extends FieldValues> = {
    field: FieldPath<TFieldValues>;
    options: Record<string, { title: string; description: string }>;
    disabled?: boolean;
};

export function SwitchFormField<TFieldValues extends FieldValues>({
    field,
    options,
    disabled,
}: SwitchFormFieldProps<TFieldValues>) {
    const form = useFormContext<TFieldValues>();

    return (
        <FormField
            control={form.control}
            name={field}
            render={({ field }) => {
                const currentValue = field.value || [];

                return (
                    <>
                        {Object.entries(options).map(
                            ([key, { title, description }]) => {
                                const checked = field.value?.includes(key);

                                function onCheckChanged(checked: boolean) {
                                    if (checked) {
                                        return field.onChange([
                                            ...currentValue,
                                            key,
                                        ]);
                                    }

                                    return field.onChange(
                                        currentValue.filter(
                                            (currentRole: string) =>
                                                currentRole !== key
                                        )
                                    );
                                }

                                return (
                                    <FormItem
                                        key={key}
                                        className="flex flex-row items-center justify-between rounded-lg border p-4"
                                    >
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                {title}
                                            </FormLabel>
                                            <FormDescription>
                                                {description}
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={checked}
                                                onCheckedChange={onCheckChanged}
                                                disabled={disabled}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }
                        )}
                    </>
                );
            }}
        />
    );
}
