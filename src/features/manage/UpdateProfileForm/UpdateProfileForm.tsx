import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { InputSkeleton, FormSkeleton } from '@/components/Skeleton/Skeleton';

const schema = Yup.object({
    emailAddress: Yup.string()
        .label('Email Address')
        .default('')
        .max(254)
        .email()
        .required(),
    firstName: Yup.string().label('First Name').default('').max(50).required(),
    lastName: Yup.string().label('Last Name').default('').max(50).required(),
    dateOfBirth: Yup.string().label('Date Of Birth').default('').required()
});

export type UpdateProfileFormValues = Yup.InferType<typeof schema>;

type UpdateProfileFormProps = {
    options?: JSX.Element;
    initialValues?: UpdateProfileFormValues;
    onSubmit: (values: UpdateProfileFormValues) => void;
};

export const UpdateProfileForm = ({
    initialValues,
    onSubmit,
    options
}: UpdateProfileFormProps) => {
    if (!initialValues) {
        return (
            <FormSkeleton>
                <InputSkeleton className="mb-3" />
                <div className="sm:flex sm:gap-3">
                    <InputSkeleton className="mb-3 sm:flex-1" />
                    <InputSkeleton className="mb-3 sm:flex-1" />
                </div>
                <InputSkeleton className="mb-5" />
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
                        className="mb-5"
                    />
                    <ButtonGroup>
                        {options}
                        <Button type="submit" loading={isSubmitting}>
                            Submit
                        </Button>
                    </ButtonGroup>
                </Form>
            )}
        </Formik>
    );
};
