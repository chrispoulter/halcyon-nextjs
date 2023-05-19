import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';

const schema = Yup.object({
    emailAddress: Yup.string().label('Email Address').email().required()
});

const defaultValues = schema.getDefault();

export type ForgotPasswordFormValues = Yup.InferType<typeof schema>;

type ForgotPasswordFormProps = {
    onSubmit: (values: ForgotPasswordFormValues) => void;
};

export const ForgotPasswordForm = ({ onSubmit }: ForgotPasswordFormProps) => {
    const {
        handleSubmit,
        control,
        formState: { isSubmitting }
    } = useForm<ForgotPasswordFormValues>({
        defaultValues,
        resolver: yupResolver(schema)
    });

    return (
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Input
                label="Email Address"
                name="emailAddress"
                type="email"
                maxLength={254}
                autoComplete="username"
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
