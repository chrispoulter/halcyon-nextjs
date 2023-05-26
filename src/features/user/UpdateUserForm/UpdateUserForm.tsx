import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/Input/Input';
import { ToggleGroup } from '@/components/ToggleGroup/ToggleGroup';
import { Button } from '@/components/Button/Button';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import {
    FormSkeleton,
    InputSkeleton,
    ToggleGroupSkeleton
} from '@/components/Skeleton/Skeleton';
import { Role, roleOptions } from '@/utils/auth';
import { isLessThanOrEqualToday, getToday } from '@/utils/date';

const schema = z.object({
    emailAddress: z.string().max(254).email(),
    firstName: z.string().max(50).nonempty(),
    lastName: z.string().max(50).nonempty(),
    dateOfBirth: z.coerce.date().refine(isLessThanOrEqualToday, {
        message: 'The field must be a date on or before today'
    }),
    roles: z.array(z.nativeEnum(Role)).optional()
});

export type UpdateUserFormValues = z.infer<typeof schema>;

export type UpdateUserFormState = { isSubmitting: boolean };

type UpdateUserFormProps = {
    user?: UpdateUserFormValues;
    isDisabled?: boolean;
    onSubmit: (values: UpdateUserFormValues) => void;
    options?: (state: UpdateUserFormState) => JSX.Element;
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

export const UpdateUserFormInternal = ({
    user,
    isDisabled,
    onSubmit,
    options
}: UpdateUserFormProps) => {
    const {
        handleSubmit,
        control,
        formState: { isSubmitting }
    } = useForm<UpdateUserFormValues>({
        defaultValues: user,
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
                max={getToday()}
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

export const UpdateUserForm = ({
    user,
    isDisabled,
    onSubmit,
    options
}: UpdateUserFormProps) => {
    if (!user) {
        return <UpdateUserFormLoading />;
    }

    return (
        <UpdateUserFormInternal
            user={user}
            isDisabled={isDisabled}
            onSubmit={onSubmit}
            options={options}
        />
    );
};
