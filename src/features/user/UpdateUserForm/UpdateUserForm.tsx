import { Formik, Form, Field } from 'formik';
import { object, string, array, InferType, number } from 'yup';
import { Input } from '@/components/Form/Input';
import { InputSkeleton } from '@/components/Form/InputSkeleton';
import { DatePicker } from '@/components/Form/DatePicker';
import { ToggleGroup } from '@/components/Form/ToggleGroup';
import { ToggleGroupSkeleton } from '@/components/Form/ToggleGroupSkeleton';
import { Button } from '@/components/Button/Button';
import { ButtonGroup } from '@/components/Button/ButtonGroup';
import { FormSkeleton } from '@/components/Form/FormSkeleton';
import { roleOptions } from '@/utils/auth';
import '@/utils/yup';

const schema = object({
    emailAddress: string().label('Email Address').max(254).email().required(),
    firstName: string().label('First Name').max(50).required(),
    lastName: string().label('Last Name').max(50).required(),
    dateOfBirth: string().label('Date Of Birth').required().dateOnly().past(),
    roles: array().of(string().label('Role').required()).label('Roles'),
    version: number().label('Version').required()
});

export type UpdateUserFormValues = InferType<typeof schema>;

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
}: UpdateUserFormInternalProps) => (
    <Formik
        initialValues={user}
        validationSchema={schema}
        onSubmit={onSubmit}
        enableReinitialize
    >
        {({ isSubmitting }) => (
            <Form noValidate>
                <Field type="hidden" name="version" />
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
