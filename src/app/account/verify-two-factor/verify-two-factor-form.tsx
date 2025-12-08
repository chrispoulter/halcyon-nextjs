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

export type VerifyTwoFactorFormValues = z.infer<typeof schema>;

type VerifyTwoFactorFormProps = {
    loading?: boolean;
    onSubmit: (values: VerifyTwoFactorFormValues) => void;
};

export function VerifyTwoFactorForm({
    loading,
    onSubmit,
}: VerifyTwoFactorFormProps) {
    const form = useForm<VerifyTwoFactorFormValues>({
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
                type="text"
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
                disabled={loading}
            />

            <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
                <LoadingButton type="submit" loading={loading}>
                    Submit
                </LoadingButton>
            </div>
        </form>
    );
}
