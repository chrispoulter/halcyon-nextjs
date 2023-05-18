import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
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

const schema = Yup.object({
    emailAddress: Yup.string()
        .label('Email Address')
        .default('')
        .max(254)
        .email()
        .required(),
    firstName: Yup.string().label('First Name').default('').max(50).required(),
    lastName: Yup.string().label('Last Name').default('').max(50).required(),
    dateOfBirth: Yup.string().label('Date Of Birth').default('').required(),
    roles: Yup.array()
        .of(
            Yup.string<Role>()
                .label('Role')
                .oneOf(Object.values(Role))
                .required()
        )
        .label('Roles')
});

export type UpdateUserFormValues = Yup.InferType<typeof schema>;

export type UpdateUserFormState = { isSubmitting: boolean };

type UpdateUserFormProps = {
    options?: (state: UpdateUserFormState) => JSX.Element;
    defaultValues?: UpdateUserFormValues;
    isDisabled?: boolean;
    onSubmit: (values: UpdateUserFormValues) => void;
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
    defaultValues,
    isDisabled,
    onSubmit,
    options
}: UpdateUserFormProps) => {
    const {
        handleSubmit,
        control,
        formState: { isSubmitting }
    } = useForm<UpdateUserFormValues>({
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
    defaultValues,
    isDisabled,
    onSubmit,
    options
}: UpdateUserFormProps) => {
    if (!defaultValues) {
        return <UpdateUserFormLoading />;
    }

    return (
        <UpdateUserFormInternal
            defaultValues={defaultValues}
            isDisabled={isDisabled}
            onSubmit={onSubmit}
            options={options}
        />
    );
};
