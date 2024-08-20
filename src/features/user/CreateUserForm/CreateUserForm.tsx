import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/Form/Input';
import { DatePicker } from '@/components/Form/DatePicker';
import { ToggleGroup } from '@/components/Form/ToggleGroup';
import { Button } from '@/components/Button/Button';
import { ButtonGroup } from '@/components/Button/ButtonGroup';
import { Role, roleOptions } from '@/utils/auth';
import { isInPast } from '@/utils/dates';

const schema = z
    .object({
        emailAddress: z
            .string({ message: 'Email Address is a required field' })
            .max(254, 'Password must be no more than 254 characters')
            .email('Email Address must be a valid email'),
        password: z
            .string({ message: 'Password is a required field' })
            .min(8, 'Password must be at least 8 characters')
            .max(50, 'Password must be no more than 50 characters'),
        confirmPassword: z.string({
            message: 'Confirm Password is a required field'
        }),
        firstName: z
            .string({ message: 'First Name is a required field' })
            .max(50, 'First Name must be no more than 50 characters'),
        lastName: z
            .string({ message: 'Last Name is a required field' })
            .max(50, 'Last Name must be no more than 50 characters'),
        dateOfBirth: z
            .string({
                message: 'Date of Birth is a required field'
            })
            .date('Date Of Birth must be a valid date')
            .refine(isInPast, { message: 'Date Of Birth must be in the past' }),
        roles: z.array(z.nativeEnum(Role)).optional()
    })
    .refine(data => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword']
    });

export type CreateUserFormValues = z.infer<typeof schema>;

type CreateUserFormProps = {
    options?: JSX.Element;
    onSubmit: (values: CreateUserFormValues) => void;
};

export const CreateUserForm = ({ onSubmit, options }: CreateUserFormProps) => {
    const {
        handleSubmit,
        control,
        formState: { isSubmitting }
    } = useForm<CreateUserFormValues>({
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
                className="mb-3"
            />
            <div className="sm:flex sm:gap-3">
                <Input
                    control={control}
                    label="Password"
                    name="password"
                    type="password"
                    maxLength={50}
                    autoComplete="new-password"
                    required
                    className="mb-3 sm:flex-1"
                />
                <Input
                    control={control}
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    maxLength={50}
                    autoComplete="new-password"
                    required
                    className="mb-3 sm:flex-1"
                />
            </div>
            <div className="sm:flex sm:gap-3">
                <Input
                    control={control}
                    label="First Name"
                    name="firstName"
                    type="text"
                    maxLength={50}
                    autoComplete="given-name"
                    required
                    className="mb-3 sm:flex-1"
                />
                <Input
                    control={control}
                    label="Last Name"
                    name="lastName"
                    type="text"
                    maxLength={50}
                    autoComplete="family-name"
                    required
                    className="mb-3 sm:flex-1"
                />
            </div>
            <DatePicker
                control={control}
                label="Date Of Birth"
                name="dateOfBirth"
                required
                autoComplete={['bday-day', 'bday-month', 'bday-year']}
                className="mb-3"
            />
            <div className="mb-5">
                <span className="mb-2 block text-sm font-medium text-gray-800">
                    Roles
                </span>
                <ToggleGroup
                    control={control}
                    name="roles"
                    options={roleOptions}
                />
            </div>
            <ButtonGroup>
                {options}
                <Button type="submit" loading={isSubmitting}>
                    Submit
                </Button>
            </ButtonGroup>
        </form>
    );
};
