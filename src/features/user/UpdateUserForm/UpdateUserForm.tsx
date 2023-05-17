import { Formik, Form } from 'formik';
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
    initialValues?: UpdateUserFormValues;
    isDisabled?: boolean;
    onSubmit: (values: UpdateUserFormValues) => void;
};

export const UpdateUserForm = ({
    initialValues,
    isDisabled,
    onSubmit,
    options
}: UpdateUserFormProps) => {
    if (!initialValues) {
        return (
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
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={onSubmit}
        >
            {({ isSubmitting }) => (
                <Form noValidate>
                    <Input
                        label="Email Address"
                        name="emailAddress"
                        type="email"
                        maxLength={254}
                        autoComplete="username"
                        required
                        disabled={isSubmitting}
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
                            disabled={isSubmitting}
                            className="mb-3 sm:flex-1"
                        />
                        <Input
                            label="Last Name"
                            name="lastName"
                            type="text"
                            maxLength={50}
                            autoComplete="family-name"
                            required
                            disabled={isSubmitting}
                            className="mb-3 sm:flex-1"
                        />
                    </div>
                    <Input
                        label="Date Of Birth"
                        name="dateOfBirth"
                        type="date"
                        autoComplete="bday"
                        required
                        disabled={isSubmitting}
                        className="mb-3"
                    />
                    <div className="mb-5">
                        <span className="mb-2 block text-sm font-medium text-gray-800">
                            Roles
                        </span>
                        <ToggleGroup
                            name="roles"
                            options={roleOptions}
                            disabled={isSubmitting}
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
};
