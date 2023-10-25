import { Formik, Form } from 'formik';
import { InferType, object, string } from 'yup';
import { Input } from '@/components/Input/Input';
import { InputSkeleton } from '@/components/Input/InputSkeleton';
import { DatePicker } from '@/components/DatePicker/DatePicker';
import { Button } from '@/components/Button/Button';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { FormSkeleton } from '@/components/Form/FormSkeleton';
import '@/utils/validation';

const schema = object({
    emailAddress: string().label('Email Address').max(254).email().required(),
    firstName: string().label('First Name').max(50).required(),
    lastName: string().label('Last Name').max(50).required(),
    dateOfBirth: string()
        .label('Date Of Birth')
        .required()
        .past()
        .transformDateOnly()
});

export type UpdateProfileFormValues = InferType<typeof schema>;

type UpdateProfileFormProps = {
    profile?: UpdateProfileFormValues;
    onSubmit: (values: UpdateProfileFormValues) => void;
    options?: JSX.Element;
};

type UpdateProfileFormInternalProps = UpdateProfileFormProps & {
    profile: UpdateProfileFormValues;
};

const UpdateProfileFormLoading = () => (
    <FormSkeleton>
        <InputSkeleton className="mb-3" />
        <div className="sm:flex sm:gap-3">
            <InputSkeleton className="mb-3 sm:flex-1" />
            <InputSkeleton className="mb-3 sm:flex-1" />
        </div>
        <InputSkeleton className="mb-5" />
    </FormSkeleton>
);

const UpdateProfileFormInternal = ({
    profile,
    onSubmit,
    options
}: UpdateProfileFormInternalProps) => (
    <Formik
        initialValues={profile}
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
                <DatePicker
                    label="Date Of Birth"
                    name="dateOfBirth"
                    autoComplete={['bday-day', 'bday-month', 'bday-year']}
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

export const UpdateProfileForm = ({
    profile,
    onSubmit,
    options
}: UpdateProfileFormProps) => {
    if (!profile) {
        return <UpdateProfileFormLoading />;
    }

    return (
        <UpdateProfileFormInternal
            profile={profile}
            onSubmit={onSubmit}
            options={options}
        />
    );
};
