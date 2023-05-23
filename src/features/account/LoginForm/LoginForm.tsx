import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';

const schema = z.object({
    emailAddress: z.string().email(),
    password: z.string()
});

export type LoginFormValues = z.infer<typeof schema>;

type LoginFormProps = {
    onSubmit: (values: LoginFormValues) => void;
    className?: string;
};

export const LoginForm = ({ onSubmit, className }: LoginFormProps) => {
    const {
        handleSubmit,
        control,
        formState: { isSubmitting }
    } = useForm<LoginFormValues>({
        resolver: zodResolver(schema)
    });

    return (
        <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className={className}
        >
            <Input
                label="Email Address"
                name="emailAddress"
                type="email"
                maxLength={254}
                autoComplete="username"
                required
                control={control}
                className="mb-3"
            />
            <Input
                label="Password"
                name="password"
                type="password"
                maxLength={50}
                autoComplete="current-password"
                required
                control={control}
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
