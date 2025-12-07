import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextField } from '@/components/form/text-field';
import { LoadingButton } from '@/components/loading-button';

const schema = z.object({
    code: z
        .string({ message: 'Code must be a valid string' })
        .min(6, 'Code must be at least 6 characters')
        .max(6, 'Code must be no more than 6 characters'),
});

export type TwoFactorFormValues = z.infer<typeof schema>;

type TwoFactorFormProps = {
    loading?: boolean;
    onSubmit: (values: TwoFactorFormValues) => void;
};

export function TwoFactorForm({ loading, onSubmit }: TwoFactorFormProps) {
    const form = useForm<TwoFactorFormValues>({
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
