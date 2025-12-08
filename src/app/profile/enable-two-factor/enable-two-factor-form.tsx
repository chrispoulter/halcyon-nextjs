import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextField } from '@/components/form/text-field';
import { LoadingButton } from '@/components/loading-button';

const schema = z.object({
    verificationCode: z
        .string({ message: 'Verification Code must be a valid string' })
        .regex(/^[0-9]{6}$/, 'Verification Code must be 6 digits'),
});

export type EnableTwoFactorFormValues = z.infer<typeof schema>;

type EnableTwoFactorFormProps = {
    loading?: boolean;
    onSubmit: (values: EnableTwoFactorFormValues) => void;
    children?: React.ReactNode;
};

export function EnableTwoFactorForm({
    loading,
    onSubmit,
    children,
}: EnableTwoFactorFormProps) {
    const form = useForm<EnableTwoFactorFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            verificationCode: '',
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
                name="verificationCode"
                label="Verification Code"
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
