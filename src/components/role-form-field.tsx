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
import { Role, roles } from '@/lib/definitions';

type RoleFormFieldProps = {
    field: string;
};

export function RoleFormField({ field }: RoleFormFieldProps) {
    const form = useFormContext();

    return (
        <FormField
            control={form.control}
            name={field}
            render={({ field }) => {
                const currentValue = field.value || [];

                return (
                    <>
                        {Object.entries(roles).map(
                            ([role, { title, description }]) => (
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
                                            checked={field.value?.includes(
                                                role
                                            )}
                                            onCheckedChange={(checked) => {
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
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        )}
                    </>
                );
            }}
        />
    );
}
