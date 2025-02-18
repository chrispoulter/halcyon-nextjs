import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';

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
        <FormField
            name={name}
            render={({ field: { value = [], onChange } }) => {
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
                                        value.filter(
                                            (item: string) => item !== key
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
