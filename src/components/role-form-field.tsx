import { useFormContext } from 'react-hook-form';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Role, roleDetails } from '@/lib/session-types';

type RoleFormFieldProps = {
    field: string;
    disabled?: boolean;
};

export function RoleFormField({ field, disabled }: RoleFormFieldProps) {
    const form = useFormContext();

    return (
        <FormField
            control={form.control}
            name={field}
            render={({ field }) => {
                const currentValue = field.value || [];

                return (
                    <>
                        {Object.entries(roleDetails).map(
                            ([role, { title, description }]) => {
                                const checked = field.value?.includes(role);

                                const onCheckChanged = (checked: boolean) => {
                                    if (checked) {
                                        return field.onChange([
                                            ...currentValue,
                                            role,
                                        ]);
                                    }

                                    return field.onChange(
                                        currentValue.filter(
                                            (currentRole: Role) =>
                                                currentRole !== role
                                        )
                                    );
                                };

                                return (
                                    <FormItem
                                        key={role}
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
