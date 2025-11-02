import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { LoadingButton } from '@/components/loading-button';

const schema = z.object({
    emailAddress: z.email('Email Address must be a valid email'),
});

export type ForgotPasswordFormValues = z.infer<typeof schema>;

type ForgotPasswordFormProps = {
    loading?: boolean;
    onSubmit: (data: ForgotPasswordFormValues) => void;
};

export function ForgotPasswordForm({
    loading,
    onSubmit,
}: ForgotPasswordFormProps) {
    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            emailAddress: '',
        },
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

                <Field orientation="horizontal">
                    <LoadingButton type="submit" loading={loading}>
                        Submit
                    </LoadingButton>
                </Field>
            </FieldGroup>
        </form>
    );
}
