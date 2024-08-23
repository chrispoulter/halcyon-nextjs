import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/Form/Input';
import { Button } from '@/components/Button/Button';
import { ButtonGroup } from '@/components/Button/ButtonGroup';

const schema = z.object({
    emailAddress: z
        .string({ message: 'Email Address is a required field' })
        .email('Email Address must be a valid email')
});

export type ForgotPasswordFormValues = z.infer<typeof schema>;

export type ForgotPasswordFormProps = {
    onSubmit: (values: ForgotPasswordFormValues) => void;
};

export const ForgotPasswordForm = ({ onSubmit }: ForgotPasswordFormProps) => {
    const {
        handleSubmit,
        control,
        formState: { isSubmitting }
    } = useForm<ForgotPasswordFormValues>({
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
                disabled={isSubmitting}
                className="mb-5"
            />
            <ButtonGroup>
                <Button type="submit" loading={isSubmitting}>
                    Submit
                </Button>
            </ButtonGroup>
        </form>
    );
};
