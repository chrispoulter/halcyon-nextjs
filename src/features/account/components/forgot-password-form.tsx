import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { ButtonGroup } from '@/components/button-group';

const schema = z.object({
    emailAddress: z
        .string({ message: 'Email Address is a required field' })
        .email('Email Address must be a valid email')
});

export type ForgotPasswordFormValues = z.infer<typeof schema>;

export type ForgotPasswordFormProps = {
    isLoading?: boolean;
    onSubmit: (values: ForgotPasswordFormValues) => void;
};

export const ForgotPasswordForm = ({
    isLoading,
    onSubmit
}: ForgotPasswordFormProps) => {
    const { handleSubmit, control } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(schema)
    });

    return (
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Input
                control={control}
                label="Email Address"
                name="emailAddress"
                type="email"
                maxLength={254}
                autoComplete="username"
                required
                disabled={isLoading}
                className="mb-5"
            />
            <ButtonGroup>
                <Button type="submit" loading={isLoading}>
                    Submit
                </Button>
            </ButtonGroup>
        </form>
    );
};
