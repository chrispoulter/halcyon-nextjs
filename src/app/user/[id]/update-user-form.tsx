import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { GetUserResponse } from '@/app/user/user-types';
import { Form } from '@/components/ui/form';
import { LoadingButton } from '@/components/loading-button';
import { DateFormField } from '@/components/date-form-field';
import { SwitchFormField } from '@/components/switch-form-field';
import { TextFormField } from '@/components/text-form-field';
import { isInPast } from '@/lib/dates';
import { Role, roles } from '@/lib/definitions';

const schema = z.object({
    emailAddress: z
        .string({ message: 'Email Address must be a valid string' })
        .email('Email Address must be a valid email'),
    firstName: z
        .string({ message: 'First Name must be a valid string' })
        .min(1, 'First Name is a required field')
        .max(50, 'First Name must be no more than 50 characters'),
    lastName: z
        .string({ message: 'Last Name must be a valid string' })
        .min(1, 'Last Name is a required field')
        .max(50, 'Last Name must be no more than 50 characters'),
    dateOfBirth: z
        .string({
            message: 'Date of Birth must be a valid string',
        })
        .date('Date Of Birth must be a valid date')
        .refine(isInPast, { message: 'Date Of Birth must be in the past' }),
    roles: z
        .array(
            z.nativeEnum(Role, {
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
    disabled?: boolean;
    onSubmit: (data: UpdateUserFormValues) => void;
    children?: React.ReactNode;
};

export function UpdateUserForm({
    user,
    loading,
    disabled,
    onSubmit,
    children,
}: UpdateUserFormProps) {
    const form = useForm<UpdateUserFormValues>({
        resolver: zodResolver(schema),
        values: user,
    });

    return (
        <Form {...form}>
            <form
                noValidate
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <TextFormField
                    name="emailAddress"
                    label="Email Address"
                    type="email"
                    maxLength={254}
                    autoComplete="username"
                    required
                    disabled={loading || disabled}
                />

                <div className="flex flex-col gap-6 sm:flex-row">
                    <TextFormField
                        name="firstName"
                        label="First Name"
                        maxLength={50}
                        autoComplete="given-name"
                        required
                        disabled={loading || disabled}
                        className="flex-1"
                    />
                    <TextFormField
                        name="lastName"
                        label="Last Name"
                        maxLength={50}
                        autoComplete="family-name"
                        required
                        disabled={loading || disabled}
                        className="flex-1"
                    />
                </div>

                <DateFormField
                    name="dateOfBirth"
                    label="Date Of Birth"
                    autoComplete={['bday-day', 'bday-month', 'bday-year']}
                    required
                    disabled={loading || disabled}
                />

                <SwitchFormField
                    name="roles"
                    options={roles}
                    disabled={loading || disabled}
                />

                <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
                    {children}

                    <LoadingButton
                        type="submit"
                        loading={loading}
                        disabled={disabled}
                    >
                        Submit
                    </LoadingButton>
                </div>
            </form>
        </Form>
    );
}
