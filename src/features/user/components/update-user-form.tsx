import { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/input';
import { InputSkeleton } from '@/components/input-skeleton';
import { DatePicker } from '@/components/date-picker';
import { ToggleGroup } from '@/components/toggle-group';
import { ToggleGroupSkeleton } from '@/components/toggle-group-skeleton';
import { Button } from '@/components/button';
import { ButtonGroup } from '@/components/button-group';
import { FormSkeleton } from '@/components/form-skeleton';
import { Role, roleOptions } from '@/lib/roles';
import { isInPast } from '@/lib/dates';

const schema = z.object({
    emailAddress: z
        .string({ message: 'Email Address is a required field' })
        .min(1, 'Email Address is a required field')
        .max(254, 'Password must be no more than 254 characters')
        .email('Email Address must be a valid email'),
    firstName: z
        .string({ message: 'First Name is a required field' })
        .min(1, 'First Name is a required field')
        .max(50, 'First Name must be no more than 50 characters'),
    lastName: z
        .string({ message: 'Last Name is a required field' })
        .min(1, 'Last Name is a required field')
        .max(50, 'Last Name must be no more than 50 characters'),
    dateOfBirth: z
        .string({ message: 'Date of Birth is a required field' })
        .min(1, 'Date Of Birth is a required field')
        .date('Date Of Birth must be a valid date')
        .refine(isInPast, { message: 'Date Of Birth must be in the past' }),
    roles: z.array(z.nativeEnum(Role)).optional()
});

export type UpdateUserFormValues = z.infer<typeof schema>;

type UpdateUserFormProps = {
    user?: UpdateUserFormValues;
    options?: JSX.Element;
    isDisabled?: boolean;
    isLoading?: boolean;
    onSubmit: (values: UpdateUserFormValues) => void;
};

type UpdateUserFormInternalProps = UpdateUserFormProps & {
    user: UpdateUserFormValues;
};

const UpdateUserFormLoading = () => (
    <FormSkeleton>
        <InputSkeleton className="mb-3" />
        <div className="sm:flex sm:gap-3">
            <InputSkeleton className="mb-3 sm:flex-1" />
            <InputSkeleton className="mb-3 sm:flex-1" />
        </div>
        <InputSkeleton className="mb-3" />
        <ToggleGroupSkeleton className="mb-5" />
    </FormSkeleton>
);

const UpdateUserFormInternal = ({
    user,
    options,
    isLoading,
    isDisabled,
    onSubmit
}: UpdateUserFormInternalProps) => {
    const { handleSubmit, control } = useForm<UpdateUserFormValues>({
        resolver: zodResolver(schema),
        values: user
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
                disabled={isLoading || isDisabled}
                className="mb-3"
            />
            <div className="sm:flex sm:gap-3">
                <Input
                    control={control}
                    label="First Name"
                    name="firstName"
                    type="text"
                    maxLength={50}
                    autoComplete="given-name"
                    required
                    disabled={isLoading || isDisabled}
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
                    disabled={isLoading || isDisabled}
                    className="mb-3 sm:flex-1"
                />
            </div>
            <DatePicker
                control={control}
                label="Date Of Birth"
                name="dateOfBirth"
                required
                autoComplete={['bday-day', 'bday-month', 'bday-year']}
                disabled={isLoading || isDisabled}
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
                    disabled={isLoading || isDisabled}
                />
            </div>
            <ButtonGroup>
                {options}
                <Button type="submit" loading={isLoading} disabled={isDisabled}>
                    Submit
                </Button>
            </ButtonGroup>
        </form>
    );
};

export const UpdateUserForm = ({ user, ...props }: UpdateUserFormProps) => {
    if (!user) {
        return <UpdateUserFormLoading />;
    }

    return <UpdateUserFormInternal {...props} user={user} />;
};
