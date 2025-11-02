import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import type { GetUserResponse } from '@/app/user/data/get-user';
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { LoadingButton } from '@/components/loading-button';
import { isInPast } from '@/lib/dates';
import { Role, roleOptions, roles } from '@/lib/definitions';

const schema = z.object({
    emailAddress: z.email('Email Address must be a valid email'),
    firstName: z
        .string({ message: 'First Name must be a valid string' })
        .min(1, 'First Name is a required field')
        .max(50, 'First Name must be no more than 50 characters'),
    lastName: z
        .string({ message: 'Last Name must be a valid string' })
        .min(1, 'Last Name is a required field')
        .max(50, 'Last Name must be no more than 50 characters'),
    dateOfBirth: z.iso
        .date('Date Of Birth must be a valid date')
        .refine(isInPast, { message: 'Date Of Birth must be in the past' }),
    roles: z
        .array(
            z.enum(roles, {
                message: 'Role must be a valid user role',
            }),
            { message: 'Role must be a valid array' }
        )
        .optional(),
});

export type UpdateUserFormValues = z.infer<typeof schema>;

type UpdateUserFormProps = {
    user: GetUserResponse;
    loading?: boolean;
    onSubmit: (data: UpdateUserFormValues) => void;
    children?: React.ReactNode;
};

export function UpdateUserForm({
    user,
    loading,
    onSubmit,
    children,
}: UpdateUserFormProps) {
    const form = useForm<UpdateUserFormValues>({
        resolver: zodResolver(schema),
        values: user,
    });

    return (
        <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <Controller
                    name="emailAddress"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                                Email Address
                            </FieldLabel>
                            <Input
                                {...field}
                                type="email"
                                maxLength={254}
                                autoComplete="username"
                                required
                                disabled={loading}
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="firstName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                                First Name
                            </FieldLabel>
                            <Input
                                {...field}
                                maxLength={50}
                                autoComplete="given-name"
                                required
                                disabled={loading}
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="lastName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                                Last Name
                            </FieldLabel>
                            <Input
                                {...field}
                                maxLength={50}
                                autoComplete="family-name"
                                required
                                disabled={loading}
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="dateOfBirth"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                                Date Of Birth
                            </FieldLabel>
                            <Input
                                {...field}
                                type="date"
                                required
                                disabled={loading}
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="roles"
                    control={form.control}
                    render={({ field, fieldState }) => {
                        function onCheckChanged(key: string, checked: boolean) {
                            if (checked) {
                                return field.onChange([
                                    ...(field.value || []),
                                    key,
                                ]);
                            }

                            return field.onChange(
                                field.value?.filter(
                                    (item: string) => item !== key
                                )
                            );
                        }

                        return (
                            <>
                                {Object.entries(roleOptions).map(
                                    ([key, { title, description }]) => (
                                        <Field
                                            key={key}
                                            orientation="horizontal"
                                            data-invalid={fieldState.invalid}
                                            className='rounded-lg border p-4'
                                        >
                                            <FieldContent>
                                                <FieldLabel
                                                    htmlFor={`${field.name}-${key}`}
                                                >
                                                    {title}
                                                </FieldLabel>
                                                <FieldDescription>
                                                    {description}
                                                </FieldDescription>
                                                {fieldState.invalid && (
                                                    <FieldError
                                                        errors={[
                                                            fieldState.error,
                                                        ]}
                                                    />
                                                )}
                                            </FieldContent>
                                            <Switch
                                                id={`${field.name}-${key}`}
                                                name={field.name}
                                                checked={field.value?.includes(
                                                    key as Role
                                                )}
                                                value={key}
                                                onCheckedChange={(checked) =>
                                                    onCheckChanged(key, checked)
                                                }
                                                disabled={loading}
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                            />
                                        </Field>
                                    )
                                )}
                            </>
                        );
                    }}
                />

                <Field orientation="horizontal">
                    {children}

                    <LoadingButton type="submit" loading={loading}>
                        Submit
                    </LoadingButton>
                </Field>
            </FieldGroup>
        </form>
    );
}
