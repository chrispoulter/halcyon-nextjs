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
import { Role } from '@/lib/definitions';

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
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    System Administrator
                                </FormLabel>
                                <FormDescription>
                                    A system administrator has access to the
                                    entire system.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value?.includes(
                                        Role.SYSTEM_ADMINISTRATOR
                                    )}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            return field.onChange([
                                                ...currentValue,
                                                Role.SYSTEM_ADMINISTRATOR,
                                            ]);
                                        }

                                        return field.onChange(
                                            currentValue.filter(
                                                (role: Role) =>
                                                    role !==
                                                    Role.SYSTEM_ADMINISTRATOR
                                            )
                                        );
                                    }}
                                />
                            </FormControl>
                        </FormItem>
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    User Administrator
                                </FormLabel>
                                <FormDescription>
                                    A user administrator can create / update /
                                    delete users.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value?.includes(
                                        Role.USER_ADMINISTRATOR
                                    )}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            return field.onChange([
                                                ...currentValue,
                                                Role.USER_ADMINISTRATOR,
                                            ]);
                                        }

                                        return field.onChange(
                                            currentValue.filter(
                                                (role: Role) =>
                                                    role !==
                                                    Role.USER_ADMINISTRATOR
                                            )
                                        );
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </>
                );
            }}
        />
    );
}
