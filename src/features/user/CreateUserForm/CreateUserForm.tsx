import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/Input/Input';
import { ToggleGroup } from '@/components/ToggleGroup/ToggleGroup';
import { Button } from '@/components/Button/Button';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { Role, roleOptions } from '@/utils/auth';
import { isLessThanOrEqualToday } from '@/utils/date';

const schema = z
    .object({
        emailAddress: z.string().max(254).email(),
        password: z.string().min(8).max(50),
        confirmPassword: z.string().nonempty(),
        firstName: z.string().max(50).nonempty(),
        lastName: z.string().max(50).nonempty(),
        dateOfBirth: z.coerce.date().refine(isLessThanOrEqualToday, {
            message: 'The field must be a date on or before today'
        }),
        roles: z.array(z.nativeEnum(Role)).optional()
    })
    .refine(data => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword']
    });

export type CreateUserFormValues = z.infer<typeof schema>;

type CreateUserFormProps = {
    onSubmit: (values: CreateUserFormValues) => void;
    options?: JSX.Element;
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
                max={today}
                control={control}
                className="mb-3"
            />
            <div className="mb-5">
                <span className="mb-2 block text-sm font-medium text-gray-800">
                    Roles
                </span>
                <ToggleGroup
                    name="roles"
                    options={roleOptions}
                    control={control}
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
