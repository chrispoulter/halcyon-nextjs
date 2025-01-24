import type { FieldValues, UseControllerProps } from 'react-hook-form';
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
    options: Record<string, { title: string; description: string }>;
} & UseControllerProps<TFieldValues>;

export function SwitchFormField<TFieldValues extends FieldValues>({
    control,
    name,
    options,
    disabled,
}: SwitchFormFieldProps<TFieldValues>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field: { value = [] as string[], onChange } }) => {
                return (
                    <>
                        {Object.entries(options).map(
                            ([key, { title, description }]) => {
                                const checked = value.includes(key);

                                function onCheckChanged(checked: boolean) {
                                    if (checked) {
                                        return onChange([...value, key]);
                                    }

                                    return onChange(
                                        value.filter((item) => item !== key)
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
