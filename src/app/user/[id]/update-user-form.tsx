import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GetUserResponse } from '@/app/user/data/get-user';
import { TextField } from '@/components/form/text-field';
import { DateField } from '@/components/form/date-field';
import { SwitchField } from '@/components/form/switch-field';
import { LoadingButton } from '@/components/loading-button';
import { isInPast } from '@/lib/dates';
import { roleOptions, roles } from '@/lib/definitions';

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

            <SwitchField
                control={form.control}
                name="roles"
                options={roleOptions}
                disabled={loading}
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
