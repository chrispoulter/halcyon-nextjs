import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { LoadingButton } from '@/components/loading-button';
import { DateFormField } from '@/components/date-form-field';
import { TextFormField } from '@/components/text-form-field';
import { isInPast } from '@/lib/dates';

const schema = z.object({
    emailAddress: z.email('Email Address must be a valid email'),
    firstName: z
        .string({ message: 'Last Name must be a valid string' })
        .min(1, 'First Name is a required field')
        .max(50, 'First Name must be no more than 50 characters'),
    lastName: z
        .string({ message: 'Last Name must be a valid string' })
        .min(1, 'Last Name is a required field')
        .max(50, 'Last Name must be no more than 50 characters'),
    dateOfBirth: z.iso
        .date('Date Of Birth must be a valid date')
        .refine(isInPast, { message: 'Date Of Birth must be in the past' }),
});

export type UpdateProfileFormValues = z.infer<typeof schema>;

type UpdateProfileFormProps = {
    values: UpdateProfileFormValues;
    loading?: boolean;
    onSubmit: (data: UpdateProfileFormValues) => void;
    children?: React.ReactNode;
};

export function UpdateProfileForm({
    values,
    loading,
    onSubmit,
    children,
}: UpdateProfileFormProps) {
    const form = useForm<UpdateProfileFormValues>({
        resolver: zodResolver(schema),
        values,
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
                    disabled={loading}
                />

                <div className="flex flex-col gap-6 sm:flex-row">
                    <TextFormField
                        name="firstName"
                        label="First Name"
                        maxLength={50}
                        autoComplete="given-name"
                        required
                        disabled={loading}
                        className="flex-1"
                    />
                    <TextFormField
                        name="lastName"
                        label="Last Name"
                        maxLength={50}
                        autoComplete="family-name"
                        required
                        disabled={loading}
                        className="flex-1"
                    />
                </div>

                <DateFormField
                    name="dateOfBirth"
                    label="Date Of Birth"
                    autoComplete={['bday-day', 'bday-month', 'bday-year']}
                    required
                    disabled={loading}
                />

                <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
                    {children}

                    <LoadingButton type="submit" loading={loading}>
                        Submit
                    </LoadingButton>
                </div>
            </form>
        </Form>
    );
}
