import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';

const schema = Yup.object({
    emailAddress: Yup.string()
        .label('Email Address')
        .default('')
        .email()
        .required(),
    newPassword: Yup.string()
        .label('New Password')
        .default('')
        .min(8)
        .max(50)
        .required(),
    confirmNewPassword: Yup.string()
        .label('Confirm New Password')
        .default('')
        .required()
        .oneOf([Yup.ref('newPassword')], 'Passwords do not match')
});

const defaultValues = schema.getDefault();

export type ResetPasswordFormValues = Yup.InferType<typeof schema>;

type ResetPasswordFormProps = {
    onSubmit: (values: ResetPasswordFormValues) => void;
};

export const ResetPasswordForm = ({ onSubmit }: ResetPasswordFormProps) => {
    const {
        handleSubmit,
        control,
        formState: { isSubmitting }
    } = useForm<ResetPasswordFormValues>({
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
                className="mb-3"
            />
            <div className="sm:flex sm:gap-3">
                <Input
                    label="New Password"
                    name="newPassword"
                    type="password"
                    maxLength={50}
                    autoComplete="new-password"
                    required
                    control={control}
                    className="mb-5 sm:flex-1"
                />
                <Input
                    label="Confirm New Password"
                    name="confirmNewPassword"
                    type="password"
                    maxLength={50}
                    autoComplete="new-password"
                    required
                    control={control}
                    className="mb-5 sm:flex-1"
                />
            </div>
            <ButtonGroup>
                <Button type="submit" loading={isSubmitting}>
                    Submit
                </Button>
            </ButtonGroup>
        </form>
    );
};
