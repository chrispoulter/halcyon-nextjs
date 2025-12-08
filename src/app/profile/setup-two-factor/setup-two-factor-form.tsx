import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextField } from '@/components/form/text-field';
import { LoadingButton } from '@/components/loading-button';

const schema = z.object({
    code: z
        .string({ message: 'Authenticator Code must be a valid string' })
        .regex(/^[0-9]{6}$/, 'Authenticator Code must be exactly 6 digits'),
});

export type SetupTwoFactorFormValues = z.infer<typeof schema>;

type SetupTwoFactorFormProps = {
    loading?: boolean;
    onSubmit: (values: SetupTwoFactorFormValues) => void;
    children?: React.ReactNode;
};

export function SetupTwoFactorForm({
    loading,
    onSubmit,
    children,
}: SetupTwoFactorFormProps) {
    const form = useForm<SetupTwoFactorFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            code: '',
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
                name="code"
                label="Authenticator Code"
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]{6}"
                autoComplete="one-time-code"
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
    );
}
