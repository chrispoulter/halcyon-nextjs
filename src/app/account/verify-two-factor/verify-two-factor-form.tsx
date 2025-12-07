import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextField } from '@/components/form/text-field';
import { LoadingButton } from '@/components/loading-button';

const schema = z
    .object({
        code: z
            .string({ message: 'Code must be a valid string' })
            .min(6, 'Code must be at least 6 characters')
            .max(6, 'Code must be no more than 6 characters')
            .optional(),
        recoveryCode: z
            .string({ message: 'Recovery Code must be a valid string' })
            .min(8, 'Recovery Code must be at least 8 characters')
            .max(8, 'Recovery Code must be no more than 8 characters')
            .optional(),
    })
    .refine((data) => !!data.code || !!data.recoveryCode, {
        message:
            'Provide either a two factor authentication code or a recovery code',
        path: ['code'],
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
            recoveryCode: '',
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

            <TextField
                control={form.control}
                name="recoveryCode"
                label="Recovery Code (optional)"
                type="text"
                maxLength={8}
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
