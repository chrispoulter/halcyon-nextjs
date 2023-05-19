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
        .max(254)
        .email()
        .required(),
    password: Yup.string()
        .label('Password')
        .default('')
        .min(8)
        .max(50)
        .required(),
    confirmPassword: Yup.string()
        .label('Confirm Password')
        .default('')
        .required()
        .oneOf([Yup.ref('password')], 'Passwords do not match'),
    firstName: Yup.string().label('First Name').default('').max(50).required(),
    lastName: Yup.string().label('Last Name').default('').max(50).required(),
    dateOfBirth: Yup.string().label('Date Of Birth').default('').required()
});

const defaultValues = schema.getDefault();

export type RegisterFormValues = Yup.InferType<typeof schema>;

type RegisterFormProps = {
    onSubmit: (values: RegisterFormValues) => void;
    className?: string;
};

export const RegisterForm = ({ onSubmit, className }: RegisterFormProps) => {
    const {
        handleSubmit,
        control,
        formState: { isSubmitting }
    } = useForm<RegisterFormValues>({
        defaultValues,
        resolver: yupResolver(schema)
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
            <div className="sm:flex sm:gap-3">
                <Input
                    label="Password"
                    name="password"
                    type="password"
                    maxLength={50}
                    autoComplete="new-password"
                    required
                    control={control}
                    className="mb-3 sm:flex-1"
                />
                <Input
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    maxLength={50}
                    autoComplete="new-password"
                    required
                    control={control}
                    className="mb-3 sm:flex-1"
                />
            </div>
            <div className="sm:flex sm:gap-3">
                <Input
                    label="First Name"
                    name="firstName"
                    type="text"
                    maxLength={50}
                    autoComplete="given-name"
                    required
                    control={control}
                    className="mb-3 sm:flex-1"
                />
                <Input
                    label="Last Name"
                    name="lastName"
                    type="text"
                    maxLength={50}
                    autoComplete="family-name"
                    required
                    control={control}
                    className="mb-3 sm:flex-1"
                />
            </div>
            <Input
                label="Date Of Birth"
                name="dateOfBirth"
                type="date"
                autoComplete="bday"
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
