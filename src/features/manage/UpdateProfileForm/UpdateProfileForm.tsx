import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/Input/Input';
import { DatePicker } from '@/components/DatePicker/DatePicker';
import { Button } from '@/components/Button/Button';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { InputSkeleton, FormSkeleton } from '@/components/Skeleton/Skeleton';

const schema = z.object({
    emailAddress: z.string().max(254).email(),
    firstName: z.string().max(50).nonempty(),
    lastName: z.string().max(50).nonempty(),
    dateOfBirth: z.coerce.date()
});

export type UpdateProfileFormValues = z.infer<typeof schema>;

type UpdateProfileFormProps = {
    profile?: UpdateProfileFormValues;
    onSubmit: (values: UpdateProfileFormValues) => void;
    options?: JSX.Element;
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
}: UpdateProfileFormProps) => {
    const {
        handleSubmit,
        control,
        formState: { isSubmitting }
    } = useForm<UpdateProfileFormValues>({
        defaultValues: profile,
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
            <DatePicker
                label="Date Of Birth"
                name="dateOfBirth"
                required
                control={control}
                className="mb-5"
            />
            <ButtonGroup>
                {options}
                <Button type="submit" loading={isSubmitting}>
                    Submit
                </Button>
            </ButtonGroup>
        </form>
    );
};

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
