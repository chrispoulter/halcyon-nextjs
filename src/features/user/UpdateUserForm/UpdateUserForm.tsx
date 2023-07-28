import { Formik, Form } from 'formik';
import { object, string, date, array, InferType } from 'yup';
import { Input } from '@/components/Input/Input';
import { DatePicker } from '@/components/DatePicker/DatePicker';
import { ToggleGroup } from '@/components/ToggleGroup/ToggleGroup';
import { Button } from '@/components/Button/Button';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import {
    FormSkeleton,
    InputSkeleton,
    ToggleGroupSkeleton
} from '@/components/Skeleton/Skeleton';
import { Role, roleOptions } from '@/utils/auth';

const schema = object({
    emailAddress: string().label('Email Address').max(254).email().required(),
    firstName: string().label('First Name').max(50).required(),
    lastName: string().label('Last Name').max(50).required(),
    dateOfBirth: date().label('Date Of Birth').required(),
    roles: array()
        .of(string<Role>().label('Role').oneOf(Object.values(Role)).required())
        .label('Roles')
});

export type UpdateUserFormValues = InferType<typeof schema>;

export type UpdateUserFormState = { isSubmitting: boolean };

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

export const UpdateUserFormInternal = ({
    user,
    isDisabled,
    onSubmit,
    options
}: UpdateUserFormInternalProps) => (
    <Formik initialValues={user} validationSchema={schema} onSubmit={onSubmit}>
        {({ isSubmitting }) => (
            <Form noValidate>
                <Input
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
            </Form>
        )}
    </Formik>
);

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
