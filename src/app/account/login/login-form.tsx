import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { LoadingButton } from '@/components/loading-button';
import { Input } from '@/components/ui/input';

const schema = z.object({
    emailAddress: z.email('Email Address must be a valid email'),
    password: z
        .string({ message: 'Password must be a valid string' })
        .min(1, 'Password is a required field'),
});

export type LoginFormValues = z.infer<typeof schema>;

type LoginFormProps = {
    loading?: boolean;
    onSubmit: (data: LoginFormValues) => void;
};

export function LoginForm({ loading, onSubmit }: LoginFormProps) {
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            emailAddress: '',
            password: '',
        },
    });
    return (
        <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
        >
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
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                        <Input
                            {...field}
                            type="password"
                            maxLength={50}
                            autoComplete="new-password"
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

            <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
                <LoadingButton type="submit" loading={loading}>
                    Submit
                </LoadingButton>
            </div>
        </form>
    );
}
