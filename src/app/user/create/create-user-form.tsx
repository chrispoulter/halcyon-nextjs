import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
} from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { TextField } from '@/components/form/text-field';
import { DateField } from '@/components/form/date-field';
import { LoadingButton } from '@/components/loading-button';
import { isInPast } from '@/lib/dates';
import { Role, roleOptions, roles } from '@/lib/definitions';

const schema = z
    .object({
        emailAddress: z.email('Email Address must be a valid email'),
        password: z
            .string({ message: 'Password must be a valid string' })
            .min(8, 'Password must be at least 8 characters')
            .max(50, 'Password must be no more than 50 characters'),
        confirmPassword: z
            .string({
                message: 'Confirm Password must be a valid string',
            })
            .min(1, 'Confirm Password is a required field'),
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
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export type CreateUserFormValues = z.infer<typeof schema>;

type CreateUserFormProps = {
    loading?: boolean;
    onSubmit: (data: CreateUserFormValues) => void;
    children?: React.ReactNode;
};

export function CreateUserForm({
    loading,
    onSubmit,
    children,
}: CreateUserFormProps) {
    const form = useForm<CreateUserFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            emailAddress: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            roles: [],
        },
    });

    return (
        <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
        >
            <TextField
                control={form.control}
                name="emailAddress"
                label="Email Address"
                type="email"
                maxLength={254}
                autoComplete="username"
                required
                disabled={loading}
            />

            <div className="flex flex-col gap-6 sm:flex-row">
                <TextField
                    control={form.control}
                    name="password"
                    label="Password"
                    type="password"
                    maxLength={50}
                    autoComplete="new-password"
                    required
                    disabled={loading}
                />

                <TextField
                    control={form.control}
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    maxLength={50}
                    autoComplete="new-password"
                    required
                    disabled={loading}
                />
            </div>

            <div className="flex flex-col gap-6 sm:flex-row">
                <TextField
                    control={form.control}
                    name="firstName"
                    label="First Name"
                    maxLength={50}
                    autoComplete="given-name"
                    required
                    disabled={loading}
                />

                <TextField
                    control={form.control}
                    name="lastName"
                    label="Last Name"
                    maxLength={50}
                    autoComplete="family-name"
                    required
                    disabled={loading}
                />
            </div>

            <DateField
                control={form.control}
                name="dateOfBirth"
                label="Date Of Birth"
                required
                disabled={loading}
            />

            <Controller
                name="roles"
                control={form.control}
                render={({ field, fieldState }) => (
                    <div className="space-y-2">
                        {Object.entries(roleOptions).map(
                            ([key, { title, description }]) => (
                                <Field
                                    key={key}
                                    orientation="horizontal"
                                    data-invalid={fieldState.invalid}
                                    className="rounded-md border p-4"
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
                                    </FieldContent>
                                    <Switch
                                        id={`${field.name}-${key}`}
                                        name={field.name}
                                        checked={field.value?.includes(
                                            key as Role
                                        )}
                                        value={key}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                return field.onChange([
                                                    ...(field.value || []),
                                                    key,
                                                ]);
                                            }

                                            return field.onChange(
                                                field.value?.filter(
                                                    (item) => item !== key
                                                )
                                            );
                                        }}
                                        disabled={loading}
                                        aria-invalid={fieldState.invalid}
                                    />
                                </Field>
                            )
                        )}
                    </div>
                )}
            />

            <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
                {children}

                <LoadingButton type="submit" loading={loading}>
                    Submit
                </LoadingButton>
            </div>
        </form>
    );
}
