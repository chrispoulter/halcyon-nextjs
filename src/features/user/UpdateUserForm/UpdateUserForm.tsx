import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/Form/Input';
import { InputSkeleton } from '@/components/Form/InputSkeleton';
import { DatePicker } from '@/components/Form/DatePicker';
import { ToggleGroup } from '@/components/Form/ToggleGroup';
import { ToggleGroupSkeleton } from '@/components/Form/ToggleGroupSkeleton';
import { Button } from '@/components/Button/Button';
import { ButtonGroup } from '@/components/Button/ButtonGroup';
import { FormSkeleton } from '@/components/Form/FormSkeleton';
import { Role, roleOptions } from '@/utils/auth';
import { isInPast } from '@/utils/dates';

const schema = z.object({
    emailAddress: z
        .string({ message: 'Email Address is a required field' })
        .max(254, 'Password must be no more than 254 characters')
        .email('Email Address must be a valid email'),
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
});

export type UpdateUserFormValues = z.infer<typeof schema>;

export type UpdateUserFormState = {
    isSubmitting: boolean;
};

type UpdateUserFormProps = {
    user?: UpdateUserFormValues;
    isDisabled?: boolean;
    onSubmit: (values: UpdateUserFormValues) => void;
    options?: (state: UpdateUserFormState) => JSX.Element;
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
    isDisabled,
    onSubmit,
    options
}: UpdateUserFormInternalProps) => {
    const {
        handleSubmit,
        control,
        formState: { isSubmitting }
    } = useForm<UpdateUserFormValues>({
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
                disabled={isSubmitting || isDisabled}
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
                    disabled={isSubmitting || isDisabled}
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
                    disabled={isSubmitting || isDisabled}
                    className="mb-3 sm:flex-1"
                />
            </div>
            <DatePicker
                control={control}
                label="Date Of Birth"
                name="dateOfBirth"
                required
                autoComplete={['bday-day', 'bday-month', 'bday-year']}
                disabled={isSubmitting || isDisabled}
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
                    disabled={isSubmitting || isDisabled}
                />
            </div>
            <ButtonGroup>
                {options && options({ isSubmitting })}
                <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={isDisabled}
                >
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
